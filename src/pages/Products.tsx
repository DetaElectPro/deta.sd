import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useLanguage } from "@/hooks/useLanguage";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  isNew: boolean;
}

const Products = () => {
  usePageTracking();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: "1",
      name: "Product 1",
      description: "This is a description for Product 1.",
      image: "/placeholder-image.jpg",
      price: "$19.99",
      category: "agriculture",
      isNew: true,
    },
    {
      id: "2",
      name: "Product 2",
      description: "This is a description for Product 2.",
      image: "/placeholder-image.jpg",
      price: "$29.99",
      category: "manufacturing",
      isNew: false,
    },
    {
      id: "3",
      name: "Product 3",
      description: "This is a description for Product 3.",
      image: "/placeholder-image.jpg",
      price: "$39.99",
      category: "technology",
      isNew: true,
    },
    {
      id: "4",
      name: "Product 4",
      description: "This is a description for Product 4.",
      image: "/placeholder-image.jpg",
      price: "$49.99",
      category: "agriculture",
      isNew: false,
    },
    {
      id: "5",
      name: "Product 5",
      description: "This is a description for Product 5.",
      image: "/placeholder-image.jpg",
      price: "$59.99",
      category: "manufacturing",
      isNew: true,
    },
    {
      id: "6",
      name: "Product 6",
      description: "This is a description for Product 6.",
      image: "/placeholder-image.jpg",
      price: "$69.99",
      category: "technology",
      isNew: false,
    },
  ];

  const categories: Category[] = [
    { id: "agriculture", name: t("categories.agriculture") },
    { id: "manufacturing", name: t("categories.manufacturing") },
    { id: "technology", name: t("categories.technology") },
  ];

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - Fixed gradient background */}
      <section className="bg-gradient-to-r from-deta-green to-deta-green-light py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 arabic-heading">
            {t('products.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('products.description')}
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-deta-green text-white" 
                    : "border-deta-green text-deta-green hover:bg-deta-green hover:text-white"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="border-none shadow-lg hover-scale overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-48 bg-gradient-to-br from-deta-green-light to-deta-green">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-deta-gold text-white">
                        {categories.find(c => c.id === product.category)?.name}
                      </Badge>
                      {product.isNew && (
                        <Badge className="bg-green-500 text-white">
                          {t('products.new')}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-deta-green mb-3 arabic-heading">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-deta-green">
                        {product.price}
                      </span>
                      <Button size="sm" className="bg-deta-green hover:bg-deta-green/90">
                        {t('buttons.view_details')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-lg bg-gradient-to-r from-deta-green to-deta-green-light">
            <CardContent className="p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4 arabic-heading">
                {t('products.interested')}
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                {t('products.contact_text')}
              </p>
              <Button size="lg" variant="outline" className="bg-white text-deta-green border-white hover:bg-gray-100">
                {t('buttons.contact_us')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
