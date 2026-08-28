import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HardHat, X, Check } from "lucide-react";
import { categories, type CategoryId, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Sk } from "@/components/Skeletons";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Stelike Exclusives" },
      {
        name: "description",
        content: "Your Stelike Exclusives account area, currently under construction.",
      },
      { property: "og:title", content: "Profile — Stelike Exclusives" },
      {
        property: "og:description",
        content: "Your Stelike Exclusives account area.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [loading, setLoading] = useState(true);
  const [taps, setTaps] = useState(0);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (loading)
    return (
      <div className="space-y-4 px-5 pt-8">
        <Sk className="mx-auto size-24 rounded-full" />
        <Sk className="mx-auto h-5 w-40" />
        <Sk className="mx-auto h-4 w-56" />
        <Sk className="h-32 w-full" />
        <Sk className="h-32 w-full" />
      </div>
    );

  return (
    <div
      onClick={() => {
        const next = taps + 1;
        setTaps(next);
        if (next >= 5) {
          setAdmin(true);
          setTaps(0);
        }
      }}
      className="flex min-h-[70vh] flex-col items-center justify-center px-5 pb-32 text-center animate-soft"
    >
      <div className="animate-bounce">
        <HardHat className="size-14" />
      </div>
      <h1 className="mt-4 text-xl font-bold">Under construction</h1>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Accounts, saved addresses and wishlists are being built. Check back shortly.
      </p>
      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-muted">
        <div className="shimmer h-full w-full" />
      </div>

      {admin && <AdminPanel onClose={() => setAdmin(false)} />}
    </div>
  );
}

const empty = {
  name: "",
  category: "center-tables" as CategoryId,
  price: "",
  stock: "",
  image: "",
  description: "",
};

function AdminPanel({ onClose }: { onClose: () => void }) {
  const { products, addProduct, updateProduct } = useStore();
  const [tab, setTab] = useState<"add" | "edit">("add");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  const steps = ["Image", "Name & type", "Details", "Stock"];

  const save = () => {
    const product: Product = {
      id: `cus-${Date.now()}`,
      name: form.name || "Untitled piece",
      category: form.category,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      image: form.image || categories.find((c) => c.id === form.category)!.image,
      description: form.description,
      specs: [{ label: "Type", value: categories.find((c) => c.id === form.category)!.label }],
      badge: "Brand New",
    };
    addProduct(product);
    setForm(empty);
    setStep(0);
  };

  const list = products.filter(
    (p) =>
      (filter === "all" || p.category === filter) &&
      p.name.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/40 backdrop-blur-sm animate-soft"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-background p-5 text-left animate-rise"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Catalogue manager</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {(["add", "edit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-card shadow-card"
              }`}
            >
              {t === "add" ? "Add product" : "Edit existing"}
            </button>
          ))}
        </div>

        {tab === "add" ? (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      i <= step ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </span>
                  {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold">{steps[step]}</p>

            <div className="mt-3 space-y-3">
              {step === 0 && (
                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
                />
              )}
              {step === 1 && (
                <>
                  <input
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
                  />
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as CategoryId })
                    }
                    className="w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {step === 2 && (
                <>
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="h-24 w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
                  />
                  <input
                    placeholder="Price (GHS)"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
                  />
                </>
              )}
              {step === 3 && (
                <input
                  placeholder="Stock quantity"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
                />
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex-1 rounded-sm bg-card py-3 text-sm font-semibold shadow-card disabled:opacity-40"
              >
                Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex-1 rounded-sm bg-primary py-3 text-sm font-semibold text-primary-foreground"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={save}
                  className="flex-1 rounded-sm bg-primary py-3 text-sm font-semibold text-primary-foreground"
                >
                  Publish product
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <input
              placeholder="Search products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-sm bg-card px-4 py-3 text-sm shadow-card outline-none"
            />
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {(["all", ...categories.map((c) => c.id)] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setFilter(id as CategoryId | "all")}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
                    filter === id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card shadow-card"
                  }`}
                >
                  {id === "all" ? "All" : categories.find((c) => c.id === id)?.label}
                </button>
              ))}
            </div>

            <ul className="mt-3 space-y-2">
              {list.map((p) => (
                <li key={p.id} className="rounded-sm bg-card p-3 shadow-card">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="size-12 rounded-sm object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        GHS {p.price} · {p.stock} in stock
                      </p>
                    </div>
                    <button
                      onClick={() => setEditing(editing?.id === p.id ? null : p)}
                      className="rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      {editing?.id === p.id ? "Close" : "Edit"}
                    </button>
                  </div>
                  {editing?.id === p.id && (
                    <div className="mt-3 space-y-2 animate-rise">
                      <input
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        className="w-full rounded-sm border px-3 py-2 text-sm outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          value={editing.price}
                          onChange={(e) =>
                            setEditing({ ...editing, price: Number(e.target.value) || 0 })
                          }
                          className="w-full rounded-sm border px-3 py-2 text-sm outline-none"
                        />
                        <input
                          value={editing.stock}
                          onChange={(e) =>
                            setEditing({ ...editing, stock: Number(e.target.value) || 0 })
                          }
                          className="w-full rounded-sm border px-3 py-2 text-sm outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          updateProduct(editing);
                          setEditing(null);
                        }}
                        className="w-full rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                      >
                        Save changes
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
