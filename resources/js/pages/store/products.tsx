import { Head, Link, router } from '@inertiajs/react';
import { Grid3X3, LayoutList, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductCard from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { mockCategories, mockProducts } from '@/lib/mock-data';
import StoreLayout from '@/layouts/store-layout';

const allSizes = ['XS', 'S', 'M', 'L', 'XL'];
const allColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#8B4513' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Blue', hex: '#4169E1' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Floral', hex: '#FFB6C1' },
];

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

export default function Shop({ category }: { category?: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>(category || '');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [gridCols, setGridCols] = useState<3 | 4>(4);

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
        );
    };

    const toggleColor = (color: string) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedSizes([]);
        setSelectedColors([]);
    };

    const hasActiveFilters = searchQuery || selectedCategory || selectedSizes.length > 0 || selectedColors.length > 0;

    const filteredProducts = useMemo(() => {
        let products = [...mockProducts];

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            products = products.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q),
            );
        }

        // Category
        if (selectedCategory) {
            products = products.filter((p) => p.category === selectedCategory);
        }

        // Sizes
        if (selectedSizes.length > 0) {
            products = products.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
        }

        // Colors
        if (selectedColors.length > 0) {
            products = products.filter((p) =>
                p.colors.some((c) => selectedColors.includes(c.name)),
            );
        }

        // Sort
        switch (sortBy) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return products;
    }, [searchQuery, selectedCategory, selectedSizes, selectedColors, sortBy]);

    const FiltersContent = () => (
        <div className="space-y-6">
            {/* Search */}
            <div>
                <Label htmlFor="filter-search" className="mb-2 block text-sm font-semibold">Search</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="filter-search"
                        placeholder="Search products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Separator />

            {/* Categories */}
            <div>
                <h3 className="mb-3 text-sm font-semibold">Category</h3>
                <div className="space-y-2">
                    <button
                        className={`block w-full rounded-md px-2 py-1 text-left text-sm transition-colors ${!selectedCategory ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        All Categories
                    </button>
                    {mockCategories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-colors ${selectedCategory === cat.name ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            <span>{cat.name}</span>
                            <span className="text-xs text-muted-foreground">{cat.productCount}</span>
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Sizes */}
            <div>
                <h3 className="mb-3 text-sm font-semibold">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                        <button
                            key={size}
                            className={`flex h-9 w-9 items-center justify-center rounded-md border text-xs font-medium transition-colors ${selectedSizes.includes(size) ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                            onClick={() => toggleSize(size)}
                            aria-pressed={selectedSizes.includes(size)}
                            aria-label={`Size ${size}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Colors */}
            <div>
                <h3 className="mb-3 text-sm font-semibold">Color</h3>
                <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => (
                        <button
                            key={color.name}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${selectedColors.includes(color.name) ? 'border-primary scale-110' : 'border-transparent hover:border-muted-foreground/30'}`}
                            onClick={() => toggleColor(color.name)}
                            aria-pressed={selectedColors.includes(color.name)}
                            aria-label={`Color ${color.name}`}
                            title={color.name}
                        >
                            <span
                                className="h-5 w-5 rounded-full border border-border"
                                style={{ backgroundColor: color.hex }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {hasActiveFilters && (
                <>
                    <Separator />
                    <Button variant="outline" className="w-full" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" /> Clear All Filters
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <StoreLayout>
            <Head title={selectedCategory || 'Shop'} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2">
                        <li><Link href="/" className="hover:text-foreground">Home</Link></li>
                        <li>/</li>
                        <li className="text-foreground font-medium">{selectedCategory || 'Shop'}</li>
                    </ol>
                </nav>

                <div className="flex gap-8">
                    {/* Desktop sidebar filters */}
                    <aside className="hidden w-64 shrink-0 lg:block" role="complementary" aria-label="Product filters">
                        <div className="sticky top-20">
                            <h2 className="mb-4 text-lg font-semibold">Filters</h2>
                            <FiltersContent />
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Mobile filter trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="lg:hidden">
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 overflow-y-auto">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-4">
                                            <FiltersContent />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{filteredProducts.length}</span> products
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Sort */}
                                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                                    <SelectTrigger className="w-[160px]" aria-label="Sort products">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                        <SelectItem value="name-asc">Name: A-Z</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Grid toggle (desktop) */}
                                <div className="hidden items-center gap-1 md:flex">
                                    <Button
                                        variant={gridCols === 3 ? 'default' : 'ghost'}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setGridCols(3)}
                                        aria-label="3 column grid"
                                    >
                                        <LayoutList className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={gridCols === 4 ? 'default' : 'ghost'}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setGridCols(4)}
                                        aria-label="4 column grid"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active filters */}
                        {hasActiveFilters && (
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                {selectedCategory && (
                                    <Badge variant="secondary" className="gap-1">
                                        {selectedCategory}
                                        <button onClick={() => setSelectedCategory('')} aria-label={`Remove ${selectedCategory} filter`}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {selectedSizes.map((s) => (
                                    <Badge key={s} variant="secondary" className="gap-1">
                                        Size: {s}
                                        <button onClick={() => toggleSize(s)} aria-label={`Remove size ${s} filter`}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedColors.map((c) => (
                                    <Badge key={c} variant="secondary" className="gap-1">
                                        {c}
                                        <button onClick={() => toggleColor(c)} aria-label={`Remove ${c} color filter`}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {searchQuery && (
                                    <Badge variant="secondary" className="gap-1">
                                        &ldquo;{searchQuery}&rdquo;
                                        <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Product grid */}
                        {filteredProducts.length > 0 ? (
                            <div
                                className={`grid gap-4 ${gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}
                            >
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
                                <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
                                <h3 className="text-lg font-semibold">No products found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Try adjusting your filters or search query
                                </p>
                                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
