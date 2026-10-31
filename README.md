# devatech — portfólio de Ricardo Rosa

Site estático (Astro) com estudos de caso de engenharia de plataforma, em PT-BR e EN.
Publicado em https://devatech.kcompany.dev.br via GitHub Actions → Cloudflare Pages.

```bash
nvm use        # Node 24
npm ci
npm run dev    # http://localhost:4321
npm run build  # gera dist/
```

Os casos ficam em `src/content/cases/<idioma>/` e os textos da interface em `src/i18n.ts`.
