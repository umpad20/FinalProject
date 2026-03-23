import { Link, usePage, router } from '@inertiajs/react';
import {
    Heart,
    LogIn,
    Menu,
    Moon,
    Search,
    ShoppingBag,
    Sun,
    User,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useAppearance } from '@/hooks/use-appearance';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'T-Shirts', href: '/shop?category=T-Shirts' },
    { name: 'Pants', href: '/shop?category=Pants' },
    { name: 'Jackets', href: '/shop?category=Jackets' },
    { name: 'Dresses', href: '/shop?category=Dresses' },
];

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { appearance, updateAppearance } = useAppearance();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }
        const timer = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
                .then(r => r.json())
                .then(data => setSuggestions(data))
                .catch(e => console.error(e));
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setSearchOpen(false);
            setSuggestions([]);
            router.get(`/shop?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const page = usePage();
    const auth = (page.props as any).auth;
    const user = auth?.user;
    const cartCount = (page.props as any).cartCount ?? 0;

    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Skip to main content for WCAG */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
                Skip to main content
            </a>

            {/* Top announcement bar */}
            <div className="border-b border-border bg-primary text-primary-foreground">
                <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-medium">
                    Free shipping on orders over ₱2,000 | Use code{' '}
                    <strong>JAYPEE10</strong> for 10% off
                </div>
            </div>

            {/* Header */}
            <header
                className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                role="banner"
            >
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2"
                            aria-label="Jaypee Clothing Store Home"
                        >
                            <ShoppingBag className="h-7 w-7" />
                            <span className="text-lg font-semibold tracking-tight">
                                Jaypee
                                <span className="font-light">Clothing</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav
                            className="hidden lg:flex lg:items-center lg:gap-6"
                            role="navigation"
                            aria-label="Main navigation"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-1">
                            {/* Search toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(!searchOpen)}
                                aria-label="Toggle search"
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {/* Theme toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                aria-label={
                                    isDark
                                        ? 'Switch to light mode'
                                        : 'Switch to dark mode'
                                }
                            >
                                {isDark ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>

                            {/* Wishlist */}
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                aria-label="Wishlist"
                            >
                                <Link href="/favorites">
                                    <Heart className="h-5 w-5" />
                                </Link>
                            </Button>

                            {/* Cart */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                                asChild
                                aria-label="Shopping cart"
                            >
                                <Link href="/cart">
                                    <ShoppingBag className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>

                            {/* User menu */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="User menu"
                                        >
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                    >
                                        <div className="px-2 py-1.5">
                                            <p className="text-sm font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        {user.is_admin && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin/dashboard">
                                                        Admin Panel
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/customer/dashboard">
                                                My Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/customer/orders">
                                                My Orders
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings/profile">
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full"
                                            >
                                                Log Out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    aria-label="Log in"
                                >
                                    <Link href="/login">
                                        <LogIn className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Search bar */}
                    {searchOpen && (
                        <div className="border-t border-border py-3">
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search for clothing..."
                                    className="pr-10 pl-10"
                                    autoFocus
                                    aria-label="Search products"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-0 right-0 h-full"
                                    onClick={() => {
                                        setSearchOpen(false);
                                        setSearchQuery('');
                                        setSuggestions([]);
                                    }}
                                    aria-label="Close search"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {suggestions.length > 0 && (
                                <div className="absolute z-50 w-full max-w-7xl mt-2 overflow-hidden rounded-md border border-border bg-popover shadow-md relative">
                                    <div className="absolute inset-0 bg-background/95 backdrop-blur -z-10"></div>
                                    {suggestions.map((suggestion) => (
                                        <Link 
                                            key={suggestion.id} 
                                            href={`/shop/${suggestion.slug}`}
                                            className="flex items-center gap-4 px-4 py-3 hover:bg-muted/80 transition-colors border-b border-border/50 last:border-0"
                                            onClick={() => {
                                                setSearchOpen(false);
                                                setSearchQuery('');
                                                setSuggestions([]);
                                            }}
                                        >
                                            <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                                                {suggestion.image ? (
                                                    <img src={suggestion.image} alt={suggestion.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-secondary"></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{suggestion.name}</p>
                                                <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile menu sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="w-80">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            JaypeeClothing
                        </SheetTitle>
                    </SheetHeader>
                    <nav
                        className="mt-6 flex flex-col gap-1"
                        role="navigation"
                        aria-label="Mobile navigation"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="my-2 border-t border-border" />
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Main content */}
            <main id="main-content" className="flex-1" role="main">
                {children}
            </main>

            {/* Footer */}
            <footer
                className="border-t border-border bg-background"
                role="contentinfo"
            >
                <div className="mx-auto max-w-7xl px-4 py-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-6 w-6" />
                                <span className="text-lg font-semibold">
                                    Jaypee
                                    <span className="font-light">Clothing</span>
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Your go-to destination for stylish, affordable
                                clothing. Quality fashion for everyone.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/shop"
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        Shop All
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=T-Shirts"
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        T-Shirts
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=Pants"
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        Pants
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/shop?category=Jackets"
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        Jackets
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                                Support
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <span className="text-sm text-muted-foreground">
                                        Contact Us
                                    </span>
                                </li>
                                <li>
                                    <span className="text-sm text-muted-foreground">
                                        Shipping Info
                                    </span>
                                </li>
                                <li>
                                    <span className="text-sm text-muted-foreground">
                                        Returns & Exchanges
                                    </span>
                                </li>
                                <li>
                                    <span className="text-sm text-muted-foreground">
                                        FAQ
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase">
                                Contact
                            </h3>
                            <ul className="space-y-2">
                                <li className="text-sm text-muted-foreground">
                                    jaypee@clothing.com
                                </li>
                                <li className="text-sm text-muted-foreground">
                                    +63 912 345 6789
                                </li>
                                <li className="text-sm text-muted-foreground">
                                    Manila, Philippines
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Jaypee Clothing Store.
                        All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}