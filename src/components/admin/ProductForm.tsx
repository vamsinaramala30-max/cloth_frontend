"use client";

import React, { useMemo, useState } from "react";

export type AdminProductVariantInput = {
  sku: string;
  color: string;
  colorName: string;
  size: string;
  stock: number;
  images: string[];
};

export type AdminProductInput = {
  name: string;
  slug: string;
  description: string;
  basePrice: number | "";
  salePrice: number | "";
  category: "Men" | "Women" | "Kids" | "Unisex" | "";
  collections: string;
  tags: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: AdminProductVariantInput[];
};

const normalizeSlug = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const defaultVariant: AdminProductVariantInput = {
  sku: "",
  color: "",
  colorName: "",
  size: "M",
  stock: 0,
  images: [],
};

export default function ProductForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<AdminProductInput>;
  loading?: boolean;
  onSubmit: (values: AdminProductInput) => Promise<void> | void;
}) {
  const [values, setValues] = useState<AdminProductInput>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    basePrice: initial?.basePrice ?? "",
    salePrice: initial?.salePrice ?? "",
    category: (initial?.category as AdminProductInput["category"]) ?? "",
    collections: (initial?.collections as any as string) ?? "",
    tags: (initial?.tags as any as string) ?? "",
    isFeatured: initial?.isFeatured ?? false,
    isActive: initial?.isActive ?? true,
    variants: initial?.variants?.length
      ? (initial.variants as any)
      : [defaultVariant],
  });

  const derivedSlug = useMemo(() => {
    if (values.slug.trim()) return normalizeSlug(values.slug);
    return values.name ? normalizeSlug(values.name) : "";
  }, [values.slug, values.name]);

  const setField = <K extends keyof AdminProductInput>(
    key: K,
    val: AdminProductInput[K],
  ) => {
    setValues((v) => ({ ...v, [key]: val }));
  };

  const setVariant = (
    idx: number,
    patch: Partial<AdminProductVariantInput>,
  ) => {
    setValues((v) => {
      const next = [...v.variants];
      next[idx] = { ...next[idx], ...patch };
      return { ...v, variants: next };
    });
  };

  const addVariant = () =>
    setValues((v) => ({
      ...v,
      variants: [...v.variants, { ...defaultVariant }],
    }));

  const removeVariant = (idx: number) =>
    setValues((v) => ({
      ...v,
      variants:
        v.variants.length <= 1
          ? v.variants
          : v.variants.filter((_, i) => i !== idx),
    }));

  const validate = (): string | null => {
    if (!values.name.trim()) return "Product name is required.";
    if (!derivedSlug.trim()) return "Slug is required.";
    if (!values.description.trim()) return "Description is required.";
    if (values.basePrice === "") return "Base price is required.";
    if (!values.category) return "Category is required.";
    if (!Array.isArray(values.variants) || values.variants.length === 0)
      return "At least one variant is required.";

    for (let i = 0; i < values.variants.length; i++) {
      const v = values.variants[i];
      if (!v.sku.trim()) return `Variant #${i + 1}: SKU is required.`;
      if (!v.color.trim()) return `Variant #${i + 1}: Color is required.`;
      if (!v.colorName.trim())
        return `Variant #${i + 1}: Color name is required.`;
      if (!v.size.trim()) return `Variant #${i + 1}: Size is required.`;
      if (typeof v.stock !== "number" || Number.isNaN(v.stock) || v.stock < 0)
        return `Variant #${i + 1}: Stock must be a number >= 0.`;
    }

    return null;
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) {
          alert(err);
          return;
        }
        await onSubmit({ ...values, slug: derivedSlug });
      }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-white">Product Details</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Create a new product document (Mongoose Product schema).
          </p>
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Name
          </label>
          <input
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            placeholder="e.g. Quantum Silk Jacket"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Slug
          </label>
          <input
            value={values.slug}
            onChange={(e) => setField("slug", e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            placeholder="e.g. quantum-silk-jacket"
          />
          <p className="text-[11px] text-zinc-500 mt-1">
            Auto-generated from name if empty.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Description
          </label>
          <textarea
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white min-h-28 focus:outline-none focus:border-cyan-400"
            placeholder="Product description..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Base Price
          </label>
          <input
            type="number"
            value={values.basePrice}
            onChange={(e) =>
              setField(
                "basePrice",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Sale Price (optional)
          </label>
          <input
            type="number"
            value={values.salePrice}
            onChange={(e) =>
              setField(
                "salePrice",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Category
          </label>
          <select
            value={values.category}
            onChange={(e) => setField("category", e.target.value as any)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">Select...</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Collections (comma separated)
          </label>
          <input
            value={values.collections}
            onChange={(e) => setField("collections", e.target.value as any)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            placeholder="Neural Silk, Quantum Weave"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
            Tags (comma separated)
          </label>
          <input
            value={values.tags}
            onChange={(e) => setField("tags", e.target.value as any)}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            placeholder="limited, luxury, futurism"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={values.isFeatured}
                onChange={(e) => setField("isFeatured", e.target.checked)}
                className="accent-cyan-400"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
                className="accent-cyan-400"
              />
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Variants</h3>
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white hover:border-cyan-400 transition-all"
          >
            + Add Variant
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {values.variants.map((v, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Variant #{idx + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="text-xs text-zinc-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    SKU
                  </label>
                  <input
                    value={v.sku}
                    onChange={(e) => setVariant(idx, { sku: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="sku-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Size
                  </label>
                  <select
                    value={v.size}
                    onChange={(e) => setVariant(idx, { size: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Color
                  </label>
                  <input
                    value={v.color}
                    onChange={(e) => setVariant(idx, { color: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="#ffffff or Red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Color Name
                  </label>
                  <input
                    value={v.colorName}
                    onChange={(e) =>
                      setVariant(idx, { colorName: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Classic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={v.stock}
                    onChange={(e) =>
                      setVariant(idx, { stock: Number(e.target.value) })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="md:col-span-1 md:col-start-2">
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Images (comma separated URLs)
                  </label>
                  <input
                    value={v.images.join(", ")}
                    onChange={(e) =>
                      setVariant(idx, {
                        images: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="https://... , https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-end">
        <button
          type="submit"
          disabled={!!loading}
          className="px-6 py-3 rounded-lg bg-cyan-400 text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
