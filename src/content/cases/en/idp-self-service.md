---
title: Self-service infrastructure portal
summary: A Backstage form triggers reviewed automation that creates the VM or container, configures it, registers it in DNS and notifies the team. Nobody needs to know Terraform, Proxmox or Ansible to request a server.
order: 1
lang: en
caseId: idp-self-service
metric: ~108 s
metricLabel: from request to ready server
stack: [Backstage, AWX, Terraform, HCP Terraform, Ansible, Proxmox VE, Kubernetes → Nomad, Technitium DNS]
---

## The problem

Creating a server depended on whoever knew the sequence by heart: open the hypervisor, clone a template, adjust CPU and memory, find the IP, SSH in, install packages, create the DNS record, and tell the requester. Every manual step was a chance for a slightly different configuration, and the knowledge lived with one person.

It is the same situation I see in infrastructure teams at large companies: automation exists in pieces, but requests still arrive as tickets.

The goal was to run the whole path from a single form, with the same result every time.

## The solution

The request comes in through **Backstage**, which only collects validated parameters (name, type, operating system, CPU, memory, disk) and calls an **AWX workflow**. From there, nothing is done by hand.

1. **Job 1, provision:** Terraform with the `bpg/proxmox` provider creates the VM or container from a template. State lives in **HCP Terraform**, outside the executor.
2. **IP discovery:** the playbook queries the hypervisor API and publishes the IP with `set_stats`, so the next job receives it.
3. **Job 2, configure:** Ansible adds the new host with `add_host`, applies the base configuration (updates, packages, hostname), creates the DNS record and sends the notification.

| Time | Event |
|---|---|
| 0 s | Workflow triggered from the portal |
| 5 s | `terraform init` complete |
| 15–25 s | VM or container created with SSH key |
| 30 s | IP discovered, state saved |
| 60 s | SSH reachable |
| ~108 s | Base configuration, DNS and notification done |

## Decisions and trade-offs

- **Remote state from day one.** Jobs run on ephemeral executors that disappear when the run ends. Keeping state on the executor's disk would lose track of what was created. HCP Terraform solved that and added locking and history.
- **Two jobs instead of one large playbook.** Splitting provisioning from configuration lets me rerun only the configuration when it fails, without touching Terraform.
- **Ephemeral executors.** Each run gets a clean environment with nothing left over from the previous one. It started as Kubernetes pods (k3s) and later moved to Nomad jobs, since Nomad already orchestrated the rest of the lab.
- **A thin portal.** Backstage holds no infrastructure logic. It validates input and delegates. The rules live in playbooks and modules that are versioned and reviewed.
- **Credentials out of the code.** Hypervisor, HCP Terraform and DNS tokens live in the AWX credential store and the secrets manager, never in repository variables.

## Migrating the executors

Once the pipeline was stable, I measured the cost of keeping a dedicated Kubernetes cluster just to run two pods that live for less than two minutes. I moved the executors to Nomad, which was already running:

| Metric | Kubernetes (k3s) | Nomad | Gain |
|---|---:|---:|---:|
| Ephemeral job cold start | 7.84 s | 1.16 s | 6.8× |
| Dispatch latency | 397 ms | 69 ms | 5.7× |
| Platform idle RAM | 887 MB | 185 MB | −720 MB |
| End-to-end pipeline | ~108 s | ~95 s | ~12% |
| Dedicated resources | 8 GB VM | none | 1 VM freed |

The gain in total time was modest, because the real bottleneck is the OS boot and package updates. The gain that mattered was operational: one less orchestrator to maintain.

## What went wrong

> Portfolios usually leave this part out. It is where most of the learning is.

- **State was not saved, and no error showed up.** `apply` finished, but HCP Terraform never recorded the state version. The cause: an organization token cannot create state versions through the API. Only a user token can. Token type is now part of my integration checklist.
- **`-lock=false` broke the state upload** with a `409 Conflict`. Removing the lock to "speed things up" removed exactly what coordinates the write.
- **The new host was silently skipped.** AWX resolves `hosts:` against the inventory, and the freshly created IP was not there. The play was skipped without failing. Fixed with `add_host` into a dynamic group.
- **The form offered templates that did not exist.** The OS field expected VM template IDs that had never been created. Nobody noticed because only containers were being tested. I built the templates from official cloud images with the hypervisor guest agent baked in, and validated them with a real clone before enabling them.
- **A hardcoded hypervisor address.** When the node was removed from the cluster, the pipeline stopped. When the node came back with the same address, the pipeline worked again, but the defect was still there. The lesson was to treat infrastructure addresses as environment variables from the start.

## What I would do differently

- A contract test between the form and the real inventory: every option in the form must exist before a user can pick it.
- A scheduled end-to-end test that creates and destroys a resource every day and alerts when the time goes over budget.
- Start with the orchestrator the team already runs, instead of standing up a new one just for the executors.

## What this means for your team

- Infrastructure requests stop depending on whoever knows the manual sequence.
- Every creation goes through the same reviewed code, with history in Git and in the state.
- The portal is just the door. If requests come from a chatbot or a pipeline tomorrow, the automation behind it stays the same.
