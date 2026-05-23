import type MarkdownIt from "markdown-it";

const CARDS_WRAPPER = "ai-clinical-cards";
const CARD = "ai-clinical-card";
const CARD_BODY = "ai-clinical-card-body";

/** Convierte títulos en negrita (análisis legacy) a encabezados markdown */
export function preprocessClinicalMarkdown(raw: string): string {
  let text = raw;
  text = text.replace(
    /^(\d+\.\s*)\*\*([^*\n]+)\*\*\s*$/gm,
    "## $1$2",
  );
  text = text.replace(
    /^\*\*(\d+\.\s*[^*\n]+)\*\*\s*$/gm,
    "## $1",
  );
  text = text.replace(
    /^##\s+(\d+\.\s*)(.+)$/gm,
    "## $1$2",
  );
  return text;
}

function createCard(doc: Document): HTMLElement {
  const article = doc.createElement("article");
  article.className = `${CARD} bg-white rounded-2xl border border-slate-200 p-6 shadow-sm`;
  const body = doc.createElement("div");
  body.className = `${CARD_BODY}`;
  article.appendChild(body);
  return article;
}

function cardBody(card: HTMLElement): HTMLElement {
  return card.querySelector(`.${CARD_BODY}`)!;
}

/**
 * Agrupa el HTML de markdown en cards por sección (cada &lt;h2&gt; = una card).
 * Bloque previo al primer h2 (p. ej. h1 + intro) va en una card de cabecera.
 */
export function wrapClinicalHtmlInCards(html: string): string {
  if (!html.trim()) return html;
  if (typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(
    `<div data-clinical-root="1">${html}</div>`,
    "text/html",
  );
  const root = doc.querySelector("[data-clinical-root]");
  if (!root) return html;

  const elements = Array.from(root.children) as HTMLElement[];
  if (elements.length === 0) return html;

  const h2Indexes = elements
    .map((el, i) => (el.tagName === "H2" ? i : -1))
    .filter((i) => i >= 0);

  const wrapper = doc.createElement("div");
  wrapper.className = CARDS_WRAPPER;

  if (h2Indexes.length === 0) {
    const card = createCard(doc);
    const body = cardBody(card);
    for (const el of elements) {
      if (el.tagName === "H1") {
        card.insertBefore(el.cloneNode(true), body);
      } else {
        body.appendChild(el.cloneNode(true));
      }
    }
    wrapper.appendChild(card);
    return wrapper.innerHTML;
  }

  const firstH2 = h2Indexes[0]!;
  if (firstH2 > 0) {
    const intro = createCard(doc);
    const body = cardBody(intro);
    for (let i = 0; i < firstH2; i++) {
      const el = elements[i]!;
      if (el.tagName === "H1") {
        intro.insertBefore(el.cloneNode(true), body);
      } else {
        body.appendChild(el.cloneNode(true));
      }
    }
    wrapper.appendChild(intro);
  }

  for (let s = 0; s < h2Indexes.length; s++) {
    const start = h2Indexes[s]!;
    const end =
      s + 1 < h2Indexes.length ? h2Indexes[s + 1]! : elements.length;
    const card = createCard(doc);
    const body = cardBody(card);
    const heading = elements[start]!.cloneNode(true) as HTMLElement;
    card.insertBefore(heading, body);
    for (let i = start + 1; i < end; i++) {
      body.appendChild(elements[i]!.cloneNode(true));
    }
    wrapper.appendChild(card);
  }

  return wrapper.innerHTML;
}

export function renderClinicalMarkdown(
  md: MarkdownIt,
  raw: string | null | undefined,
  emptyMessage = "Sin contenido.",
): string {
  const text = raw?.trim();
  if (!text) return `<p class="ai-clinical-empty">${emptyMessage}</p>`;
  const normalized = preprocessClinicalMarkdown(text);
  return wrapClinicalHtmlInCards(md.render(normalized));
}
