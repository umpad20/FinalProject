namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@jaypee.com',
            'password' => bcrypt('admin123'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Categories (6 categories)
        $categories = [
            ['name' => 'T-Shirts', 'slug' => 't-shirts', 'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
            ['name' => 'Pants', 'slug' => 'pants', 'image' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop'],
            ['name' => 'Jackets', 'slug' => 'jackets', 'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
            ['name' => 'Hoodies', 'slug' => 'hoodies', 'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'],
            ['name' => 'Dresses', 'slug' => 'dresses', 'image' => 'https://images.unsplash.com/photo-1595777707802-f3ee4afff4e4?w=400&h=400&fit=crop'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Seed products and variants
        $this->call(ProductSeeder::class);
    }
}
