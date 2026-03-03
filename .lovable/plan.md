

# Plan de Implementacion Completo — De lo mas complejo a lo mas sencillo

## Resumen ejecutivo
Se implementaran todas las mejoras solicitadas en 6 pasos ordenados por complejidad. El plan cubre: rediseno del checkout con dos CTAs de venta, validacion estructural de pisos, textos responsivos, seguridad, y detalles de branding.

---

## Paso 1: Rediseno del Checkout con Dos Opciones de Venta (CelebrationCheckout)

**Problema actual:** El boton unico "YES! I WANT THIS CAKE!" asusta al usuario con el precio completo. El Cake Taster Box esta relegado a un link externo.

**Cambios:**
- Reemplazar el CTA unico por dos opciones claras en `CelebrationCheckout.tsx`:
  - **Opcion A (prioritaria):** "RESERVE YOUR DATE & TASTE FLAVORS — $80" — Se presenta como credito hacia el pastel final. Al hacer clic, abre el LeadForm con un flag `isTasterBox=true`.
  - **Opcion B:** "REQUEST FULL DESIGN QUOTE" — Para el presupuesto completo. Abre el LeadForm normal.
- Ambas opciones pasan por el LeadForm (datos del cliente, alergias, etc.)
- Al completar el formulario, redirige a `https://cateringabeusaleh.ca/product/custom-wedding-cake/` con `custom_price` ($80 para taster, precio total para cotizacion completa)
- Eliminar el link externo del Cake Taster Box que esta en `CakeConfigurator.tsx` (lineas 749-762), ya que ahora esta integrado en el checkout
- Textos de venta persuasivos: "Your $80 tasting becomes a credit toward your final cake"

**Archivos:** `CelebrationCheckout.tsx`, `LeadForm.tsx`, `CakeConfigurator.tsx`

---

## Paso 2: Formulario LeadForm — Modo Taster Box + Alergias Obligatorias

**Cambios:**
- Agregar prop `orderType: "taster" | "quote"` al LeadForm
- Si es taster: simplificar la UI, mostrar "$80 — Cake Taster Box" como resumen, y al enviar redirigir con `custom_price=80`
- Si es quote: mantener el flujo actual con el precio completo
- **Alergias ya son obligatorias** (verificado: `allergyAcknowledged` esta en `isFormValid`). No requiere cambios.
- Guardar el `orderType` en el campo `cake_config` JSONB al insertar en `cake_orders`

**Archivos:** `LeadForm.tsx`, `CelebrationCheckout.tsx`

---

## Paso 3: Validacion Estructural de Pisos (Tier Size Enforcement)

**Estado actual:** La funcion `getAvailableSizesForTier()` en `menuDatabase.ts` YA implementa la restriccion de que pisos superiores deben ser <= pisos inferiores. El `TierConfigPanel` ya usa `availableSizes` para filtrar.

**Verificacion necesaria:** La logica ya existe y esta correcta (lineas 169-213 de menuDatabase.ts). Los pisos superiores no pueden ser mas grandes que los inferiores porque `maxSize = Math.min(maxSize, tierBelowSize)`.

**Posible mejora:** Agregar un mensaje visual claro cuando se cambia un piso inferior a un tamano menor que el piso superior, forzando un auto-ajuste del piso superior. Actualmente si se reduce un piso inferior, el piso superior podria quedar con un tamano invalido hasta que el usuario lo edite.

**Archivos:** `menuDatabase.ts` (ajuste menor si se necesita auto-correccion), `TierConfigPanel.tsx`

---

## Paso 4: Textos Responsivos — Textos que se salen de los botones en movil

**Problema:** Textos largos como "YES! I WANT THIS CAKE!" y otros se desbordan en pantallas pequenas.

**Cambios:**
- En `CelebrationCheckout.tsx`: Reducir tamanos de fuente en movil, usar `text-sm md:text-lg` en lugar de `text-lg md:text-xl`
- Agregar `whitespace-nowrap` o `truncate` donde aplique, o dividir textos en dos lineas en movil
- Revisar el titulo "YOU BUILT THE WEDDING CAKE OF YOUR DREAMS!" — asegurar que `text-2xl md:text-4xl` sea legible sin desbordamiento
- Revisar botones CTA para que el texto quepa con `overflow-hidden text-ellipsis` o texto mas corto en movil
- Revisar el sticky header movil en `CakeConfigurator.tsx` — los labels truncados (ppl, srv, T) deben ser legibles

**Archivos:** `CelebrationCheckout.tsx`, `CakeConfigurator.tsx`

---

## Paso 5: Seguridad — Warnings pendientes

**Findings activos (level "warn"):**
1. `cake_orders_customer_data_exposure`: Todos los admins pueden ver datos de contacto. **Accion:** Ignorar con justificacion — este es un negocio pequeno donde todos los admins necesitan ver pedidos.
2. `cake_orders_anonymous_submission_tracking`: Clientes anonimos no pueden rastrear su pedido. **Accion:** Ignorar con justificacion — el flujo intencional es que el equipo contacta al cliente por email/telefono tras la submission.

**Archivos:** Solo actualizacion de findings via herramienta de seguridad, sin cambios de codigo.

---

## Paso 6: Branding y Detalles Menores

- El logo `LOGO NEGRO.png` ya esta en el bucket `email-assets` para emails. El header usa `logo-amarillo.png` y el footer `logo-horizontal.png`. Si el usuario quiere cambiarlo, necesitaria subir el archivo al proyecto.
- Los iconos de redes sociales (Instagram, Facebook) ya estan implementados en el footer (lineas 810-829 de CakeConfigurator.tsx) con links a los perfiles oficiales.
- No se requieren cambios aqui a menos que el usuario suba un nuevo logo.

---

## Orden de implementacion

1. **Paso 1 + 2** (juntos): Rediseno del checkout con dos CTAs + LeadForm con modo taster
2. **Paso 3**: Validacion estructural (verificar auto-correccion de pisos)
3. **Paso 4**: Textos responsivos en movil
4. **Paso 5**: Actualizar findings de seguridad
5. **Paso 6**: Confirmar branding (sin cambios necesarios)

