---
description: React hooks optimization patterns and performance best practices
globs: src/hooks/**/*.ts, src/components/**/*.tsx
alwaysApply: true
---

# React Hooks Best Practices

## **HOOK OPTIMIZATION PATTERNS**

### **useCallback & useMemo Usage**
```typescript
// ✅ DO: Use for expensive computations
const expensiveValue = useMemo(() => 
  data.reduce((acc, item) => acc + item.value, 0), 
  [data]
);

// ❌ DON'T: Over-memoize simple values
const simpleString = useMemo(() => `Hello ${name}`, [name]); // OVERHEAD
```

### **Custom Hook Patterns**
```typescript
// ✅ DO: Single responsibility hooks
const useApiData = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // fetch logic
  }, [url]);
  
  return { data, loading };
};

// ❌ DON'T: God hooks that do everything
const useEverything = () => {
  // 20+ lines of mixed concerns
};
```

### **Effect Dependencies**
```typescript
// ✅ DO: Minimal, specific dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]); // Only what you use

// ❌ DON'T: Excessive dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId, config, theme, locale]); // Too many
```

### **State Optimization**
```typescript
// ✅ DO: Colocate related state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

// ❌ DON'T: Separate state for related data
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
```

### **Hook Composition**
```typescript
// ✅ DO: Compose hooks logically
const useUserForm = (initialData) => {
  const { data: user, loading } = useApiData(`/users/${initialData.id}`);
  const { formData, handleChange, reset } = useForm(initialData);
  const { save, saving } = useSaveUser();
  
  return { user, loading, formData, handleChange, save, saving, reset };
};
```

### **Performance Anti-Patterns**
```typescript
// ❌ AVOID: Creating objects in render
const MyComponent = () => {
  // New object every render!
  const config = { theme: 'dark', locale: 'en' };
  
  return <ChildComponent config={config} />;
};

// ✅ FIX: Move outside or memoize
const DEFAULT_CONFIG = { theme: 'dark', locale: 'en' };

const MyComponent = () => {
  return <ChildComponent config={DEFAULT_CONFIG} />;
};
```

### **Hook Cleanup**
```typescript
// ✅ DO: Cleanup subscriptions
useEffect(() => {
  const subscription = api.subscribe(callback);
  
  return () => subscription.unsubscribe();
}, [callback]);

// ✅ DO: Cleanup timers
useEffect(() => {
  const timer = setTimeout(callback, 1000);
  
  return () => clearTimeout(timer);
}, [callback]);
```

### **Conditional Effects**
```typescript
// ✅ DO: Conditional logic inside effect
useEffect(() => {
  if (shouldFetch && userId) {
    fetchUser(userId);
  }
}, [shouldFetch, userId]);

// ❌ DON'T: Conditional effects
if (shouldFetch) {
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
}
```

### **Error Boundaries for Hooks**
```typescript
// ✅ DO: Handle errors in hooks
const useApiData = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(setData)
      .catch(setError);
  }, [url]);
  
  return { data, error };
};
```

---

**FOCUS**: Simple, performant hooks that follow React best practices without over-engineering.
