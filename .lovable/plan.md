

# Corrección del Enlace de WooCommerce

## Problema
Después de enviar el formulario de pedido, el usuario no es redirigido correctamente a WooCommerce porque:
1. La URL del producto está incorrecta (`custom-wedding-cake-2` en lugar de `custom-wedding-cake`)
2. Se abre en una pestaña nueva en lugar de redirigir directamente

## Solución
Actualizar el archivo `src/components/CelebrationCheckout.tsx` para:
- Corregir la URL del producto de WooCommerce
- Cambiar el método de redirección para que navegue en la misma pestaña

## Flujo Corregido
1. Cliente diseña su pastel
2. Hace clic en "I'm Ready to Order"
3. Aparece la pantalla de celebración (caja negra dorada)
4. Hace clic en "YES! I WANT THIS CAKE!"
5. Aparece el formulario, lo llena y envía
6. Se guarda el pedido y se envían los correos
7. **El cliente es redirigido directamente a WooCommerce** para completar el pago

---

## Detalles Técnicos

**Archivo:** `src/components/CelebrationCheckout.tsx`

**Cambio en la función `handleFormSuccess` (líneas 56-65):**

```typescript
// ANTES (incorrecto):
const handleFormSuccess = () => {
  const checkoutUrl = `https://cateringabeusaleh.ca/product/custom-wedding-cake-2/?custom_price=${totalPrice.toFixed(2)}`;
  window.open(checkoutUrl, "_blank");
  setShowLeadForm(false);
};

// DESPUÉS (correcto):
const handleFormSuccess = () => {
  const checkoutUrl = `https://cateringabeusaleh.ca/product/custom-wedding-cake/?custom_price=${totalPrice.toFixed(2)}`;
  window.location.href = checkoutUrl;
};
```

**Cambios realizados:**
1. URL corregida: `custom-wedding-cake` (sin el `-2`)
2. Redirección directa con `window.location.href` en lugar de `window.open()`
3. Eliminado `setShowLeadForm(false)` ya que la página navegará completamente

