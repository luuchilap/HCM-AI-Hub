import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation();

  const blogPosts = [
    { id: 1, titleKey: "blog.post1.title", excerptKey: "blog.post1.excerpt", author: "Dr. Nguyen Van A", date: "December 10, 2024", readTime: "5", categoryKey: "blog.categories.industryInsights", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60" },
    { id: 2, titleKey: "blog.post2.title", excerptKey: "blog.post2.excerpt", author: "Prof. Tran Thi B", date: "December 5, 2024", readTime: "7", categoryKey: "blog.categories.education", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60" },
    { id: 3, titleKey: "blog.post3.title", excerptKey: "blog.post3.excerpt", author: "Dr. Le Van C", date: "November 28, 2024", readTime: "6", categoryKey: "blog.categories.ethics", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60" },
    { id: 4, titleKey: "blog.post4.title", excerptKey: "blog.post4.excerpt", author: "Dr. Pham Thi D", date: "November 20, 2024", readTime: "8", categoryKey: "blog.categories.research", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=60" },
    { id: 5, titleKey: "blog.post5.title", excerptKey: "blog.post5.excerpt", author: "Dr. Hoang Van E", date: "November 15, 2024", readTime: "6", categoryKey: "blog.categories.healthcare", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60" },
    { id: 6, titleKey: "blog.post6.title", excerptKey: "blog.post6.excerpt", author: "Nguyen Thi F", date: "November 8, 2024", readTime: "5", categoryKey: "blog.categories.startups", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60" },
  ];

  return (
    <Layout>
      <section className="py-20 lg:py-28 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, hsl(185 70% 50%) 1px, transparent 0)`, backgroundSize: '40px 40px' }} /></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">{t("blog.badge")}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">{t("blog.title")}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed">{t("blog.description")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300">
                <div className="aspect-video overflow-hidden"><img src={post.image} alt={t(post.titleKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-6">
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">{t(post.categoryKey)}</span>
                  <h2 className="font-display font-semibold text-xl text-foreground group-hover:text-primary transition-colors mt-4 mb-2 line-clamp-2">{t(post.titleKey)}</h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{t(post.excerptKey)}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{post.author}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{post.readTime} {t("blog.minRead")}</span></div>
                  </div>
                  <Button variant="ghost" className="w-full mt-4 group-hover:bg-secondary/10" asChild><Link to={`/blog/${post.id}`}>{t("blog.readMore")}<ArrowRight className="w-4 h-4" /></Link></Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
