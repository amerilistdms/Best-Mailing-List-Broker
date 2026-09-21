# 123FormBuilder — BestMailingListBroker.com

Necesitas **dos formularios distintos** en la misma cuenta 123FormBuilder (como Medicare).  
**Los emails te llegan desde 123FormBuilder** (Notifications en cada form), no desde Vercel, hasta que configures notificaciones.

---

## Formulario 1 — Contacto simple (`/contact.html`)

**Para qué:** gente que solo quiere escribir o que les regresen la llamada. **No** es el quiz.

### Qué hacer en 123FormBuilder

1. Entra a [123FormBuilder](https://www.123formbuilder.com/).
2. **Duplica / clona** el formulario de contacto de Medicare: **ID 6979839**  
   (el que ya está embebido en findmedicareprospects.com/contact).
3. Renombra el clon: **`BMLB – Simple Contact`**.
4. Deja el form **corto**. Campos recomendados:

| Campo en 123FB | Tipo | ¿Requerido? |
|----------------|------|-------------|
| First Name | Short text | Sí |
| Last Name | Short text | Sí |
| Company | Short text | Sí |
| Email | Email | Sí |
| Phone | Phone | Sí |
| Website | URL | No |
| Message | Paragraph | Sí (ej. “How can we help?”) |
| **Lead source** | Hidden (o Short text hidden) | Valor fijo: `BestMailingListBroker.com` |

5. **Notifications** (123FB → tu form → Notifications):
   - Email al equipo AmeriList (mismo inbox que Medicare si quieres).
   - Asunto sugerido: `[BMLB Contact] {{Company}} – {{First Name}} {{Last Name}}`
   - Reply-To: email del lead.
6. **After submit:** mensaje de gracias o redirect a `https://bestmailinglistbroker.com/contact.html`
7. **Publish → Embed:**
   - Permite embed en: `bestmailinglistbroker.com`, `www.bestmailinglistbroker.com`, tu `*.vercel.app`
   - Copia el **numeric Form ID** (solo números, ej. `6980123`).

### Qué hacer en el sitio (repo)

En **`config.js`**:

```javascript
window.FORM123 = {
  contactFormId: "6980123",  // ← tu ID del clon, NO uses 6979839 (ese es Medicare)
};
```

Sube a Vercel. El embed se carga solo en `/contact`.

**No hace falta Vercel env vars** para el contacto simple si usas embed (123FB procesa el submit).

---

## Formulario 2 — Audience Builder (quiz en homepage)

**Para qué:** cuando alguien termina el **Audience Builder** y da “GET MY FREE AUDIENCE COUNT”.  
**Es otro formulario**, no el de contacto.

### Qué hacer en 123FormBuilder

1. **Duplica / clona** el form de leads del quiz de Medicare: **ID 6979581**  
   URL ref: `https://form.123formbuilder.com/6979581/findmedicareprospects`
2. Renombra: **`BMLB – Audience Builder`**
3. **Quita o adapta** campos solo Medicare (DOB, Medicare audience types, etc.).
4. **Añade / renombra** campos para coincidir con lo que envía el sitio (`app.js` → `leadPayload()`):

**Contacto (paso final del quiz):**

- First Name, Last Name, Company, Email, Phone, Website  
- Preferred Contact Method (Email / Phone / Either)

**Audiencia y targeting (texto o dropdowns):**

- Audience Type  
- Specialties  
- Other Specialty  
- Geo Type  
- Market / Geography  
- Radius Origin, Radius  
- Age From, Age To, Any Age, Gender  
- Income, Homeownership, Marital, Children  
- Consumer Extras, Consumer Notes  
- Industry, Industry Codes, Employees, Sales  
- Roles, Job Titles  
- Channel(s), Fields needed  
- Quantity, Offering, Campaign Notes, Timing  

**Campo crítico (como Medicare):**

- **Summary** — un Short text o Paragraph largo donde el sitio manda **todo el recap** en una sola línea (`summary` en el payload).  
  Si no quieres 30 campos en 123FB, puedes usar **solo contacto + Summary** y el equipo lee el recap ahí.

5. Campo oculto: **Lead source** = `BestMailingListBroker.com`  
6. **Notifications:** asunto tipo `[BMLB Audience Builder] {{Company}} – {{Email}}`  
7. Anota el **Form ID** numérico del clon (ej. `6980456`).

### Qué falta en el código (requiere el Form ID + field IDs)

Medicare envía el quiz con **`/api/lead`** en Vercel, que hace POST a 123FB con IDs de cada campo (`medicareleads/api/lead.js`).

En BMLB, **`api/lead.js` hoy es mock** (no envía nada).

**Para que el quiz te llegue por email igual que Medicare:**

1. Creas el form **698xxxx** en 123FB (arriba).
2. Nos pasas (o anotas en 123FB → cada campo → Field ID):
   - Form ID  
   - Field ID + hash de cada campo (o al menos: first, last, company, email, phone, summary)
3. En el repo se actualiza:
   - `config.js` → `audienceBuilderFormId: "6980456"`
   - `api/lead.js` → copia la lógica de Medicare con el mapa de campos BMLB

Hasta que eso esté hecho, el quiz **muestra gracias en pantalla** pero **no dispara email** (solo log en consola).

**Notifications en 123FB son obligatorias** para recibir leads del quiz una vez conectado `/api/lead`.

---

## Resumen rápido

| | Contact simple | Audience Builder |
|--|----------------|------------------|
| **Página** | `/contact.html` | Homepage `#builder` |
| **Clonar desde Medicare** | Form **6979839** | Form **6979581** |
| **Campos** | ~7 + hidden source | Contacto + targeting + **Summary** |
| **Conexión sitio** | Embed en `config.js` → `contactFormId` | `api/lead.js` + field map (pendiente ID) |
| **¿Email automático?** | Sí, vía 123FB Notifications | Sí, cuando `/api/lead` esté mapeado + Notifications |

---

## Checklist antes de producción

- [ ] Form contact clonado; ID en `config.js` → `contactFormId`
- [ ] Form builder clonado; ID anotado para dev
- [ ] Notifications email en **ambos** forms
- [ ] Dominios embed permitidos (Vercel + bestmailinglistbroker.com)
- [ ] Privacy / consent text en forms (link a AmeriList privacy policy)
- [ ] `api/lead.js` actualizado con Form ID BMLB (después de crear el form)

Referencia Medicare en repo local: `../medicareleads/contact.html` (embed 6979839), `../medicareleads/api/lead.js` (6979581).
