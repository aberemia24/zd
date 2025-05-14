---
trigger: glob
globs: frontend/src/**/*.{ts,tsx}
---

rules:
  - name: "Elementele funcționale trebuie să aibă data-testid"
    select: |
      JSXOpeningElement[
        name.name =~ /^(button|input|select|textarea|li|a)$/
      ]:not([attributes.name.name='data-testid'])
    message: "Orice element funcțional (buton, input, list item etc.) trebuie să aibă atribut data-testid unic, stabil și predictibil."