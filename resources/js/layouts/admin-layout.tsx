import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Box,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Moon,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Sun,
    Truck,
    FileText,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Inventory', href: '/admin/inventory', icon: Box },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Deliveries', href: '/admin/deliveries', icon: Truck },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) {
    const { appearance, updateAppearance } = useAppearance();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const page = usePage();
    const currentUrl = page.url;

    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Skip link */}
            <a
                href="#admin-main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
                Skip to main content
            </a>

            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 lg:relative lg:z-0',
                    sidebarCollapsed ? 'w-16' : 'w-64',
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                )}
                role="navigation"
                aria-label="Admin navigation"
            >
                {/* Sidebar header */}
                <div className="flex h-16 items-center gap-2 border-b border-border px-4">
                    <ShoppingBag className="h-6 w-6 shrink-0" />
                    {!sidebarCollapsed && (
                        <span className="text-sm font-semibold tracking-tight">
                            Jaypee<span className="font-light">Admin</span>
                        </span>
                    )}
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                    {adminNav.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive(item.href)
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            )}
                            title={sidebarCollapsed ? item.name : undefined}
                            aria-current={isActive(item.href) ? 'page' : undefined}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!sidebarCollapsed && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div className="border-t border-border p-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <ShoppingBag className="h-4 w-4 shrink-0" />
                        {!sidebarCollapsed && <span>View Store</span>}
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!sidebarCollapsed && <span>Log Out</span>}
                    </Link>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            <BarChart3 className="h-5 w-5" />
                        </Button>

                        {/* Collapse toggle (desktop only) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <BarChart3 className="h-5 w-5" />
                        </Button>

                        {title && <h1 className="text-lg font-semibold">{title}</h1>}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                A
                            </div>
                            <span className="hidden font-medium md:inline">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main id="admin-main" className="flex-1 overflow-y-auto p-4 lg:p-6" role="main">
                    {children}
                </main>
            </div>
        </div>
    );
}
