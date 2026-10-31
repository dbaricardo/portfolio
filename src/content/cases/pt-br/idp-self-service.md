---
title: Portal self-service de infraestrutura
summary: Um formulário no Backstage dispara automação revisada que cria a VM ou o container, configura, registra no DNS e avisa o time. Ninguém precisa conhecer Terraform, Proxmox ou Ansible para pedir um servidor.
order: 1
lang: pt-br
caseId: idp-self-service
metric: ~108 s
metricLabel: do pedido ao servidor pronto
stack: [Backstage, AWX, Terraform, HCP Terraform, Ansible, Proxmox VE, Kubernetes → Nomad, Technitium DNS]
---

## O problema

Criar um servidor dependia de quem sabia a sequência de cor: abrir o hipervisor, clonar um template, ajustar CPU e memória, descobrir o IP, entrar por SSH, instalar pacotes, criar o registro DNS e avisar quem pediu. Cada passo manual era uma chance de configuração diferente, e o conhecimento ficava com uma pessoa.

É o mesmo cenário que encontro em times de infraestrutura de empresas grandes: a automação existe em pedaços, mas o pedido ainda chega por chamado.

O objetivo foi fazer o caminho inteiro sair de um formulário, com o mesmo resultado toda vez.

## A solução

O pedido entra pelo **Backstage**, que só coleta parâmetros validados (nome, tipo, sistema operacional, CPU, memória, disco) e chama um **workflow do AWX**. A partir daí, nada é feito à mão.

1. **Job 1, provisionar:** Terraform com o provider `bpg/proxmox` cria a VM ou o container a partir de um template. O state fica no **HCP Terraform**, fora do executor.
2. **Descoberta de IP:** o playbook consulta a API do hipervisor e publica o IP com `set_stats`, para o job seguinte receber o valor.
3. **Job 2, configurar:** Ansible adiciona o host novo com `add_host`, aplica a configuração base (atualização, pacotes, hostname), cria o registro no DNS e envia a notificação.

| Tempo | Evento |
|---|---|
| 0 s | Workflow disparado pelo portal |
| 5 s | `terraform init` concluído |
| 15–25 s | VM ou container criado com chave SSH |
| 30 s | IP descoberto, state salvo |
| 60 s | SSH disponível |
| ~108 s | Configuração base, DNS e notificação concluídos |

## Decisões e trade-offs

- **State remoto desde o primeiro dia.** Os jobs rodam em executores efêmeros, que somem no fim da execução. Guardar o state no disco do executor perderia o controle dos recursos criados. O HCP Terraform resolveu isso e trouxe lock e histórico.
- **Dois jobs em vez de um playbook grande.** Separar provisionar de configurar permite reexecutar só a configuração quando ela falha, sem tocar no Terraform.
- **Executores efêmeros.** Cada execução recebe um ambiente limpo, sem resíduo da anterior. Começou com pods em Kubernetes (k3s) e depois migrou para jobs no Nomad, que já orquestrava o resto do laboratório.
- **Portal fino.** O Backstage não contém lógica de infraestrutura. Ele valida a entrada e delega. A regra fica nos playbooks e módulos, versionados e revisados.
- **Credenciais fora do código.** Tokens do hipervisor, do HCP Terraform e do DNS ficam no cofre de credenciais do AWX e no gerenciador de segredos, nunca em variáveis do repositório.

## A migração dos executores

Com o pipeline estável, medi o custo de manter um cluster Kubernetes dedicado só para rodar dois pods que vivem menos de dois minutos. Movi os executores para o Nomad, que já existia:

| Métrica | Kubernetes (k3s) | Nomad | Ganho |
|---|---:|---:|---:|
| Cold start do job efêmero | 7,84 s | 1,16 s | 6,8× |
| Latência de disparo | 397 ms | 69 ms | 5,7× |
| RAM ociosa da plataforma | 887 MB | 185 MB | −720 MB |
| Pipeline ponta a ponta | ~108 s | ~95 s | ~12 % |
| Recursos dedicados | VM de 8 GB | nenhum | 1 VM liberada |

O ganho no tempo total foi modesto, porque o gargalo real é o boot do sistema operacional e a atualização de pacotes. O ganho que importou foi operacional: um orquestrador a menos para manter.

## O que deu errado

> Esta parte costuma ficar de fora dos portfólios. É onde está a maior parte do aprendizado.

- **O state não era salvo e não aparecia erro.** O `apply` terminava, mas o HCP Terraform não registrava a versão do state. A causa: um token de organização não pode criar versões de state pela API. Só token de usuário pode. Hoje o tipo de token faz parte do checklist de integração.
- **`-lock=false` quebrava o upload do state** com `409 Conflict`. Tirar o lock para "acelerar" removeu justamente o que coordena a escrita.
- **O host novo era ignorado em silêncio.** O AWX resolve `hosts:` contra o inventário, e o IP recém-criado não estava lá. A play era pulada sem falha. Resolvido com `add_host` num grupo dinâmico.
- **O formulário oferecia templates que não existiam.** O campo de sistema operacional esperava IDs de templates de VM que nunca tinham sido criados. Ninguém tinha percebido porque só os containers eram testados. Criei os templates a partir de imagens cloud oficiais com o agente do hipervisor embutido e validei com um clone real antes de liberar.
- **Endereço do hipervisor fixo no código.** Quando o nó foi retirado do cluster, o pipeline parou. Quando o nó voltou com o mesmo endereço, o pipeline voltou a funcionar, mas o defeito continuou lá. A lição foi tratar endereço de infraestrutura como variável de ambiente desde o início.

## O que eu faria diferente

- Teste de contrato entre o formulário e o inventário real: cada opção do formulário precisa existir antes de aparecer para o usuário.
- Um teste ponta a ponta agendado, que cria e destrói um recurso todo dia e alerta se o tempo passar do esperado.
- Começar pelo orquestrador que o time já opera, em vez de subir um novo só para os executores.

## O que isso significa para o seu time

- O pedido de infraestrutura deixa de depender de quem conhece a sequência manual.
- Toda criação passa pelo mesmo código revisado, com histórico no Git e no state.
- O portal é só a porta. Se amanhã o pedido vier de um chatbot ou de uma pipeline, a automação por trás é a mesma.
