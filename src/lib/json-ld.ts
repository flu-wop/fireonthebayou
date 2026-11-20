/** Serialize structured data for a <script type="application/ld+json"> tag. Escapes "<" so
 *  admin-editable text can never close the script element. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
