# 📏 Spacing și Sizing Guide - Budget App 

## 🎯 Filosofia: Simple, Consistent, Fintech-Ready

**PRAGMATIC APPROACH:** Folosim TailwindCSS defaults pentru 95% din cazuri + custom tokens doar pentru spacing fintech-specific.

---

## 🏗️ TailwindCSS Default Spacing Scale (RECOMMENDED)

Budget App folosește **Tailwind standard spacing scale** pentru consistency și simplitate:

```css
/* TailwindCSS spacing - USE THESE! */
0 = 0px
1 = 4px     (0.25rem)
2 = 8px     (0.5rem) 
3 = 12px    (0.75rem)
4 = 16px    (1rem)
5 = 20px    (1.25rem)
6 = 24px    (1.5rem)
8 = 32px    (2rem)
10 = 40px   (2.5rem)
12 = 48px   (3rem)
16 = 64px   (4rem)
20 = 80px   (5rem)
24 = 96px   (6rem)
```

---

## 🔶 Carbon Copper Custom Tokens (LIMITED)

**DOAR pentru spacing specific fintech/branding:**

```typescript
// theme.ts custom spacing - minimal extended tokens
spacing: {
  0: "0",
  xs: "0.25rem", // 4px  = Tailwind: 1
  sm: "0.5rem",  // 8px  = Tailwind: 2  
  md: "1rem",    // 16px = Tailwind: 4
  lg: "1.5rem",  // 24px = Tailwind: 6
  xl: "2rem",    // 32px = Tailwind: 8
  "2xl": "3rem", // 48px = Tailwind: 12
  "3xl": "4rem", // 64px = Tailwind: 16
  "4xl": "6rem", // 96px = Tailwind: 24
}
```

**IMPORTANT:** Aceste custom tokens sunt identice cu Tailwind - există doar pentru semantic naming în componente.

---

## 🎨 Spacing Patterns Pentru Fintech

### 📱 Component Internal Spacing

```tsx
// ✅ DO: Use Tailwind defaults
<div className="p-4 m-2 gap-4">
  <Button className="px-6 py-3" />
</div>

// ✅ DO: Semantic spacing pentru fintech layouts  
<div className="p-md gap-lg">
  <TransactionRow className="py-sm px-md" />
</div>
```

### 🏛️ Layout Structure

```tsx
// ✅ Page containers - Tailwind defaults
<main className="max-w-7xl mx-auto px-4 py-8">
  
  // ✅ Section spacing
  <section className="mb-12">
    
    // ✅ Card spacing  
    <div className="p-6 rounded-lg">
      
      // ✅ Form elements
      <div className="space-y-4">
        <Input className="w-full" />
      </div>
    </div>
  </section>
</main>
```

### 💰 Financial Data Spacing

```tsx
// ✅ Transaction rows - consistent vertical rhythm
<div className="space-y-2">
  <TransactionItem className="py-3 px-4" />
</div>

// ✅ Financial totals - emphasis spacing
<div className="mt-8 pt-6 border-t border-carbon-200">
  <div className="text-2xl font-semibold text-carbon-900">
    Total: €1,234.56
  </div>
</div>

// ✅ Category groups - logical separation  
<div className="mb-6">
  <h3 className="mb-3 text-lg font-medium">Food & Dining</h3>
  <div className="space-y-1">
    {transactions.map(tx => <TransactionRow key={tx.id} />)}
  </div>
</div>
```

---

## 🚦 Responsive Spacing (Mobile-First)

```tsx
// ✅ Mobile-first responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  
  // ✅ Responsive gaps
  <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2">
    
    // ✅ Responsive containers
    <Card className="p-4 md:p-6" />
  </div>
</div>
```

---

## 📋 Common Spacing Patterns

### Button Groups
```tsx
// ✅ Horizontal button groups
<div className="flex gap-3">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>

// ✅ Vertical button stacks
<div className="space-y-2">
  <Button className="w-full">Primary Action</Button>
  <Button variant="ghost" className="w-full">Secondary</Button>
</div>
```

### Form Layout
```tsx
// ✅ Standard form spacing
<form className="space-y-6">
  <div className="grid gap-4 md:grid-cols-2">
    <Input label="Amount" className="w-full" />
    <Select label="Category" className="w-full" />
  </div>
  
  <div className="space-y-2">
    <Textarea label="Description" className="w-full" />
    <FormError message="Please provide a description" />
  </div>
  
  <div className="flex justify-end gap-3 pt-4">
    <Button type="submit">Save Transaction</Button>
  </div>
</form>
```

### Data Tables 
```tsx
// ✅ Table spacing pentru financial data
<table className="w-full">
  <thead>
    <tr className="border-b border-carbon-200">
      <th className="py-3 px-4 text-left">Date</th>
      <th className="py-3 px-4 text-right">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-carbon-100">
      <td className="py-2 px-4">Dec 15, 2024</td>
      <td className="py-2 px-4 text-right">€125.50</td>
    </tr>
  </tbody>
</table>
```

---

## 🎯 Best Practices

### ✅ DO
- **Use Tailwind defaults** pentru consistency: `p-4`, `gap-6`, `space-y-3`
- **Mobile-first responsive**: `p-4 md:p-6 lg:p-8`
- **Semantic custom spacing** doar pentru fintech layouts specifice
- **Consistent vertical rhythm** pentru text și content: `space-y-4`
- **Logical grouping** cu spacing: related = tight, unrelated = loose

### ❌ DON'T  
- **Nu folosi arbitrary values**: `p-[13px]` - folosește scale-ul
- **Nu mixa units**: stick to rem-based scale
- **Nu complexifica** cu spacing tokens peste tot - Tailwind e suficient
- **Nu ignora responsive**: sempre mobile-first approach

---

## 🔧 Implementation Status

- ✅ **TailwindCSS default spacing** - fully available
- ✅ **Custom semantic tokens** - defined în theme.ts  
- ✅ **Responsive patterns** - mobile-first approach
- ✅ **Component spacing** - consistent patterns documented
- 🔄 **Migration needed** - remove arbitrary spacing în components existente

---

## 🎨 Carbon Copper Context

**Spacing în Brand Context:**
- **Carbon backgrounds** - generous whitespace pentru premium feel
- **Copper accents** - tight spacing pentru emphasis
- **Financial data** - tabular spacing pentru accuracy
- **Interactive elements** - sufficient touch targets (44px minimum)

**Visual Hierarchy:**
```css
/* Premium spacing pentru Carbon Copper brand */
.fintech-premium {
  padding: 2rem;           /* Generous container padding */
  margin-bottom: 3rem;     /* Strong section separation */
}

.copper-highlight {
  padding: 0.75rem 1.5rem; /* Tight copper element padding */
  margin: 0.5rem 0;        /* Controlled copper margins */
}
``` 