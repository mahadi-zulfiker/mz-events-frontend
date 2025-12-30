'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    ArrowRight,
    Calendar,
    Clock,
    Search,
    Tag,
    ChevronRight,
    TrendingUp,
    Mail
} from 'lucide-react';
import { useState } from 'react';

const blogPosts = [
    {
        id: 1,
        title: "Top 10 Hidden Gem Experiences in Barcelona",
        excerpt: "Discover the secret spots that locals love, from underground jazz clubs to rooftop gardens with panoramic views.",
        date: "Dec 28, 2025",
        readTime: "6 min read",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
        author: "Elena Rodriguez"
    },
    {
        id: 2,
        title: "How to Build a Thriving Local Community",
        excerpt: "Community isn't just about location; it's about connection. Learn the key strategies to foster meaningful real-life interactions.",
        date: "Dec 25, 2025",
        readTime: "8 min read",
        category: "Community",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
        author: "David Chen"
    },
    {
        id: 3,
        title: "Designing for IRL Connections in a Digital World",
        excerpt: "As our lives become more digital, the value of physical presence grows. Explore how we design events that prioritize human touch.",
        date: "Dec 20, 2025",
        readTime: "5 min read",
        category: "Design",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        author: "Sophie Thompson"
    },
    {
        id: 4,
        title: "The Rise of Secret Supper Clubs",
        excerpt: "Why intimate, invitation-only dining experiences are becoming the hottest ticket in cities worldwide.",
        date: "Dec 15, 2025",
        readTime: "7 min read",
        category: "Food",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        author: "Marcello Rossi"
    },
    {
        id: 5,
        title: "A Night with Berlin's Underground DJ Scene",
        excerpt: "We go behind the scenes of the most exclusive warehouse parties in the world's most vibrant nightlife capital.",
        date: "Dec 10, 2025",
        readTime: "10 min read",
        category: "Nightlife",
        image: "https://images.unsplash.com/photo-1514525253361-b83a85f08a83?auto=format&fit=crop&w=1200&q=80",
        author: "Lukas Weber"
    }
];

const categories = ["All", "Travel", "Community", "Design", "Food", "Nightlife", "Tech"];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = blogPosts.filter(post =>
        (selectedCategory === "All" || post.category === selectedCategory) &&
        (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Header */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Journal</span>.
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Stories, guides, and insights from the heart of our community. Explore the world of curated IRL experiences.
                        </p>
                    </motion.div>
                </section>

                {/* Filters & Search */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between border-y border-white/5 py-8">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredPosts.map((post, idx) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group flex flex-col h-full bg-slate-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                        {post.category}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                                    </div>

                                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight mb-4 group-hover:text-indigo-400 transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">By {post.author}</span>
                                        <Link href={`/blog/${post.id}`} className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                                            Read More <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-slate-700" />
                            </div>
                            <p className="text-xl text-slate-400 font-medium">No articles found matching your criteria.</p>
                            <button
                                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                                className="mt-4 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </section>

                {/* Newsletter Signup */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                    <div className="relative rounded-[3rem] p-12 lg:p-20 overflow-hidden text-center bg-indigo-600">
                        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                            <Mail size={300} className="text-white" />
                        </div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                                Don't miss the next <br /> big story.
                            </h2>
                            <p className="text-indigo-100 text-xl font-medium">
                                Subscribe to our newsletter for exclusive community insights and event previews.
                            </p>
                            <form
                                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                                onSubmit={(e) => { e.preventDefault(); }}
                            >
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:bg-white/20 transition-all font-bold"
                                    required
                                />
                                <button className="px-8 py-4 rounded-full bg-white text-indigo-600 font-black hover:scale-105 active:scale-95 transition-all">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
