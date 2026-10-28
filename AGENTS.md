# 🏋️ Diretrizes e Instruções do Projeto — Helmans Academy (AGENTS.md)

Este documento serve como guia mestre para qualquer agente de IA (Antigravity, Cursor, Copilot, Claude) ou desenvolvedor que for atuar neste repositório. **Siga rigorosamente as diretrizes, padrões de qualidade e decisões arquiteturais aqui descritas.**

---

## 🎯 1. Visão Geral do Projeto & Ecossistema

O projeto **Helmans Academy** é o ecossistema digital completo para uma academia de musculação e alta performance fitness, composto por dois pilares estratégicos:

1. **🌐 Site Institucional & Landing Page de Alta Conversão (FOCO EXCLUSIVO DESTA CONVERSA):**
   - Portal público voltado a novos alunos e visitantes.
   - Focado em atração, apresentação da estrutura/biomecânica da academia, tabela de planos, agendamento de aula experimental, cálculo de métricas fitness (IMC/TDEE), depoimentos, localização e conversão direta via WhatsApp.
   - Porta de entrada unificada com link direto para a futura **"Área do Aluno"**.

2. **📱 SaaS de Gestão de Academia (DESENVOLVIDO EM CONVERSA SEPARADA):**
   - Sistema de gestão interna: portal do aluno, ficha de treino digital, controle de catracas/acesso, financeiro, assinaturas e CRM de atendimento.
   - *Nota de Isolamento:* O desenvolvimento da lógica de negócio e backend do SaaS será realizado em outra conversa dedicada, mantendo aqui apenas os pontos de ancoragem e integração do site (ex: botão de login do aluno, webhooks de captação de leads e variáveis de ambiente).

---

## 📁 2. Estrutura de Diretórios do Ecossistema

O repositório é organizado de forma modular, com separação estrita de responsabilidades:

```text
Helmans-Academy/
├── site/                     # 🌐 Site Institucional & Landing Page (Foco desta conversa)
│   ├── public/               # Ativos estáticos e imagens WebP
│   ├── src/                  # Componentes (Navbar, Hero, Calculadora, Planos, etc.)
│   ├── index.html            # Ponto de entrada com SEO e Schema.org
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts        # Porta 3000
├── web/                      # 📱 Frontend do SaaS (Painel de Gestão & Portal do Aluno)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/                   # ⚙️ Backend do SaaS (API em Go, Banco de Dados, Catracas)
│   ├── cmd/
│   ├── internal/
│   └── go.mod
├── assets/                   # 🎨 Mídias, logotipos e vetores da marca
├── imagems/                  # 📷 Fotos e arquivos de imagem originais
└── AGENTS.md                 # 📜 Diretrizes mestres do projeto
```

---

## 🚀 3. Escopo desta Conversa: O Site da Helmans Academy (`site/`)

Nesta conversa, atuaremos exclusivamente na concepção, design e engenharia do **Site da Helmans Academy**:
- **Público-alvo:** Pessoas que buscam musculação séria, emagrecimento, hipertrofia, saúde, bem-estar e alta performance.
- **Objetivo Principal:** Maximizar a taxa de conversão de visitantes em alunos matriculados ou visitas agendadas.
- **Tom de Voz & Estilo:** Forte, motivador, profissional, acolhedor e com foco em resultados reais.

---

## 🛠️ 3. Stack Tecnológica Oficial do Site

| Camada | Tecnologia | Decisão & Racional |
| :--- | :--- | :--- |
| **Framework / Bundler** | **React + Vite + TypeScript** | Velocidade extrema de carregamento, tipagem estática rigorosa (zero bugs em produção), SPA moderna e modular. |
| **Estilização** | **Tailwind CSS** | Design system altamente customizável, performance com CSS purgado, responsividade fluida via classes utilitárias. |
| **Ícones** | **Lucide React** | Biblioteca vetorial leve, moderna e rica em ícones fitness, saúde, contato e usabilidade. |
| **Interatividade** | **Componentes Modulares** | Modais de agendamento de aula grátis, calculadora fitness de IMC/TDEE, acordeom de FAQ, carrossel de fotos e lightbox. |
| **SEO & Metadados** | **HTML5 Semântico + Schema.org** | Estruturação de dados `ExerciseGym` / `LocalBusiness`, OpenGraph para compartilhamento impecável no WhatsApp e redes sociais. |

---

## 🎨 4. Identidade Visual & Branding Oficial

A identidade visual da **Helmans Academy** transmite solidez, disciplina, biomecânica e energia premium:

### 4.1. Paleta de Cores Oficial
- **Fundo Primário (Dark / Onyx):** `#0B0B0B` e `#121212` (estética dark mode imersiva, moderna e imponente).
- **Superfícies & Cards:** `#18181B` e `#27272A` (camadas de contraste com bordas sutis `border-zinc-800`).
- **Destaque Primário (Golden Yellow / Ouro):** `#EAB308` e `#FACC15` (inspirado no logotipo oficial, trazendo energia, força e foco nos botões de CTA).
- **Tipografia & Alto Contraste:** `#FFFFFF` (títulos e textos de alto impacto) e `#A1A1AA` (subtítulos e descrições técnicas).
- **Feedback & Sucesso:** `#22C55E` (verde esmeralda para botão de WhatsApp e confirmações).

### 4.2. Ativos e Imagens do Projeto
- **Logotipo Oficial:** Localizado em `imagems/logo_oficial.jpg` (emblema com halteres, escudo e tipografia dourada marcante).
- **Fotografia Real:** Imagens do ambiente real da academia (como `foto_1.jpg`, destacando o rack de halteres de peso livre e o piso emborrachado profissional).
- **Padrão de Mídias:** Sempre otimizar imagens para o formato moderno **WebP** com tamanho estritamente **inferior a 300 KB**.

---

## 📑 5. Estrutura e Seções Estratégicas do Site

O site é organizado como uma Landing Page contínua de alta conversão (*One-Page* de navegação suave):

1. **Header / Navbar Superior (Sticky com Glassmorphism):**
   - Logotipo oficial da Helmans Academy.
   - Links de navegação com rolagem suave: *Sobre nós*, *Estrutura*, *Modalidades*, *Calculadora Fitness*, *Planos*, *Depoimentos*, *Localização & Horários*.
   - Botões de Ação: CTA destacado *"Aula Experimental"* e link secundário *"Área do Aluno"* (atalho para o SaaS).
   - Menu hambúrguer lateral moderno para smartphones.

2. **Hero Section (Primeira Impressão de Alto Impacto):**
   - Título impactante com tipografia marcante (ex: *"Construa Sua Melhor Versão na Maior Estrutura de Musculação"*).
   - Badges de autoridade: *Estrutura Climatizada*, *Instrutores Qualificados*, *Área de Peso Livre Completa*, *Biomecânica de Ponta*.
   - CTA duplo: Botão primário *"Agendar Aula Grátis"* + Botão secundário *"Conhecer os Planos"*.

3. **Sobre Nós & Filosofia da Helmans Academy:**
   - A história, missão e o diferencial do ambiente: musculação levada a sério com acompanhamento humanizado e equipamentos projetados para o movimento perfeito.

4. **Galeria & Estrutura (Fotos Reais):**
   - Grid moderno com fotos reais da academia (`foto_1.jpg`, etc.).
   - Destaques visuais: área de halteres pesados, máquinas articuladas, área de cardio, vestiários e atendimento.

5. **Modalidades & Treinos:**
   - Musculação & Hipertrofia
   - Emagrecimento & Condicionamento
   - Treinamento Funcional
   - Acompanhamento Personalizado & Avaliação Física (Bioimpedância)

6. **Calculadora Fitness Interativa (Elemento de Engajamento & Captação):**
   - Ferramenta no próprio site para cálculo instantâneo de **IMC** e estimativa de **Taxa Metabólica Basal / Gasto Calórico Diário**.
   - Resultado dinâmico com incentivo para o visitante agendar uma avaliação física presencial gratuita.

7. **Planos & Mensalidades (Tabela Clara e Transparente):**
   - **Plano Mensal:** Flexibilidade total, sem fidelidade.
   - **Plano Trimestral:** Foco em continuidade de resultados.
   - **Plano Anual / VIP:** Melhor custo-benefício, destaque com borda dourada, badge *"Mais Escolhido"*, parcelamento e benefícios extras.
   - Botão de contratação direta direcionando para o WhatsApp ou checkout online.

8. **Grade de Horários de Funcionamento:**
   - Visualização organizada: Segunda a Sexta, Sábados, Domingos e Feriados.
   - Status dinâmico em tempo real (*"Aberto agora"* / *"Fechado no momento"*).

9. **Depoimentos & Prova Social:**
   - Avaliações reais de alunos, notas no Google (5 estrelas), histórico de evolução física e satisfação.

10. **Localização, Mapa & Contato:**
    - Endereço completo, mapa interativo incorporado, telefones e links sociais (Instagram, WhatsApp).

11. **Footer Completo:**
    - Resumo institucional, links rápidos, aviso de direitos autorais e conformidade com a LGPD.

12. **Elementos Flutuantes de Conversão:**
    - **Botão Flutuante do WhatsApp:** Canto inferior direito, com tooltip chamativo e mensagem pré-formatada.
    - **Modal de Agendamento de Aula Grátis:** Acessível via botões do site com validação de nome, WhatsApp e preferência de turno.

---

## 🔗 6. Pontos de Integração com o Futuro SaaS

Para manter a separação de escopos sem retrabalho futuro, o site já deve nascer preparado para conectar com o SaaS:
- **Botão "Área do Aluno":** Consome a variável de ambiente `VITE_SAAS_URL` (com fallback elegante ou modal informativo caso o SaaS ainda esteja em implantação).
- **Captação de Leads / Aula Grátis:** O formulário pode enviar dados via Webhook / Endpoint REST parametrizado (`VITE_LEADS_API_URL`) ou disparar diretamente para o WhatsApp da recepção com texto estruturado.

---

## 🔒 7. Regras Mandatórias de Segurança & Boas Práticas (Adaptadas de AGENTS.md)

1. **Validação Estrita de Formulários:**
   - Nenhum formulário (contato, agendamento de aula, cálculo fitness) pode ser enviado sem validação completa de formato (número de WhatsApp com DDD válido, nome com tamanho mínimo, caracteres sanitizados).
2. **Proteção Anti-Spam (Honeypot):**
   - Incluir campo oculto honeypot nos formulários de agendamento para descartar submissões automáticas de bots sem incomodar o usuário com captchas complexos.
3. **Zero Chaves / Secrets Expostos:**
   - Proibido hardcode de chaves de API ou URLs de servidores internos no código-fonte. Utilizar exclusivamente variáveis de ambiente com prefixo `VITE_`.
4. **Proteção contra XSS e Sanitização:**
   - Nunca renderizar dados dinâmicos via `dangerouslySetInnerHTML`. Sanitizar todo conteúdo inserido por usuários.
   - Todos os links externos (WhatsApp, Instagram, Maps) **DEVEM** conter `target="_blank" rel="noopener noreferrer"`.
5. **Privacidade e Conformidade LGPD:**
   - Formulários de coleta de dados devem conter aviso claro de consentimento para contato comercial da academia.
   - Não armazenar dados sensíveis no `localStorage` sem necessidade estrita.

---

## 🎨 8. Diretrizes de Engenharia Frontend & Excelência em UX/UI

### 📱 8.1. Responsividade Universal e Mobile-First Obrigatória
- **Adaptação Total a Dispositivos:**
  - **Smartphones (< 640px):** Layout vertical impecável, botões e touch targets com área de toque mínima de **44x44px**, tipografia legível e menu mobile com transição suave.
  - **Tablets (640px – 1024px):** Grid de 2 colunas para cards de planos, calculadoras e fotos.
  - **Desktops (1024px – 1536px):** Layout rico com espaçamentos confortáveis, cards em 3 ou 4 colunas.
  - **Monitores Ultrawide (> 1536px):** Limitação de largura máxima controlada (`max-w-7xl mx-auto`) para evitar que o conteúdo se espalhe desordenadamente.

### ⚡ 8.2. Otimização Extrema de Performance & UX (CLS = 0)
- **Zero Layout Shifts (CLS = 0):** Todos os containers de imagens, cards e seções dinâmicas devem possuir dimensões mínimas ou aspect-ratio definidos para evitar saltos de tela durante o carregamento.
- **Feedback Imediato:** Qualquer clique em botão de envio ou cálculo deve apresentar feedback visual instantâneo (loaders, transições de cor ou estados de sucesso).
- **Acessibilidade:** Alto contraste entre texto e fundo (atendendo às diretrizes WCAG AA), navegação amigável via teclado e foco visível.

### 🖼️ 8.3. Padrão Mandatório de Mídia e Imagens (Formato WebP & Limite < 300KB)
- **Formato Mandatório WebP:** Todas as fotografias do site devem ser convertidas/salvas preferencialmente no formato **`.webp`**. O formato SVG permanece o padrão recomendado para ícones e formas vetoriais.
- **Teto Estrito de Peso (< 300 KB):** Nenhuma imagem rasterizada inserida no site deve exceder **300 KB**.
- **Carregamento Inteligente:** Atributos `loading="lazy"` e `decoding="async"` em todas as imagens abaixo da dobra (*below the fold*).

---

## 🚀 9. Comandos e Validações Frequentes

### No diretório do Site (`site/`):
```bash
cd site
npm install              # Instala dependências do projeto
npm run dev              # Inicia servidor local de desenvolvimento rápido (Vite na porta 3000)
npm run build            # Executa validação de tipos TypeScript e compilação de produção (tsc -b && vite build)
npm run preview          # Visualiza o build de produção localmente
```

> [!IMPORTANT]
> Antes de considerar qualquer funcionalidade concluída, execute `npm run build` e certifique-se de que a compilação gera **ZERO erros de TypeScript** e **ZERO avisos de bundle crítico**.
