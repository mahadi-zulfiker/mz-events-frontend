'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    MessageSquare,
    Heart,
    ChevronRight,
    User,
    Facebook,
    Twitter,
    Linkedin
} from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: "Top 10 Hidden Gem Experiences in Barcelona",
        content: `
      # Discovering the Secret Soul of Barcelona
      Barcelona is a city of layers. Beyond the Sagrada Família and the crowded Las Ramblas lies a world of intimate experiences waiting to be discovered.

      ## 1. The Underground Jazz Scene
      Tucked away in the Raval district, you'll find spots like *JazzSí Club*, where the air is thick with history and syncopation. It's not just music; it's a nightly ritual for the neighborhood's soul.

      ## 2. Rooftop Gardens of Gràcia
      While tourists flock to Park Güell, locals head to the private rooftop gardens in Gràcia. These spaces often host tiny, 15-person gatherings centered around a single artist or a slow-cooked meal.

      ## 3. The Forgotten Library
      In the Gothic Quarter, there's a library that hasn't changed since the 19th century. Silence isn't a rule; it's a presence. It's the perfect place to meet other bibliophiles who prefer the scent of old paper to the glow of a screen.
    `,
        date: "Dec 28, 2025",
        readTime: "6 min read",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
        author: "Elena Rodriguez",
        authorRole: "Travel Architect",
        authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?fit=crop&w=120&q=80"
    },
    {
        id: 2,
        title: "How to Build a Thriving Local Community",
        content: `
      # The Architecture of Belonging
      In an age of digital isolation, the importance of physical community has never been more vital. But how do you build one from scratch?

      ## Start with Shared Vulnerability
      Communities don't grow around success; they grow around shared challenges. The most successful hosts on EventHub are those who aren't afraid to say, "I'm lonely, let's have dinner."

      ## Consistency is the New Cool
      Meeting once is an event. Meeting every third Thursday is a community. The predictability of gathering builds trust faster than any ice-breaker game ever could.

      ## The Power of the Small Group
      Research shows that the "sweet spot" for connection is between 6 and 12 people. Large events are for networking; small gatherings are for friendship.
    `,
        date: "Dec 25, 2025",
        readTime: "8 min read",
        category: "Community",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
        author: "David Chen",
        authorRole: "Community Strategist",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=120&q=80"
    },
    {
        id: 3,
        title: "Designing for IRL Connections in a Digital World",
        content: `
      # Designing the Human Experience
      When we design events, we aren't just thinking about the venue or the music. We're thinking about the "Human Journey."

      ## The First Five Minutes
      The "Arrival" is the most vulnerable moment for any guest. A great host greets you not just with a drink, but with an introduction. "Meet Sara, she also loves brutalist architecture."

      ## Minimizing the Screen Interruption
      We encourage "Analog Zones." It's not about banning phones; it's about creating an environment where checking your screen feels like a distraction from something better.

      ## Sensory Anchoring
      We use scent, tactile materials, and room temperature to anchor people in the moment. When you engage all five senses, the digital world simply fades away.
    `,
        date: "Dec 20, 2025",
        readTime: "5 min read",
        category: "Design",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        author: "Sophie Thompson",
        authorRole: "UX Designer",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=120&q=80"
    },
    {
        id: 4,
        title: "The Rise of Secret Supper Clubs",
        content: `
      # Beyond the Restaurant Walls
      Why are thousands of people choosing to eat in stranger's homes instead of Michelin-starred restaurants?

      ## The Quest for Authenticity
      Restaurants are commercial transactions. Supper clubs are social gifts. There's a fundamental difference in energy when you're sitting in someone's living room.

      ## The Set Menu as Freedom
      In a world of infinite choice, being told what to eat is a luxury. It removes the friction of decision-making and allows guest to focus entirely on the conversation.

      ## Intimacy as the Ultimate Status
      The most exclusive experiences today aren't the most expensive; they're the hardest to find. Supper clubs represent a shift toward "Social Capital" over monetary capital.
    `,
        date: "Dec 15, 2025",
        readTime: "7 min read",
        category: "Food",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        author: "Marcello Rossi",
        authorRole: "Culinary Curator",
        authorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 5,
        title: "A Night with Berlin's Underground DJ Scene",
        content: `
      # The Pulse of the Night
      Berlin's nightlife isn't just about the music. It's about a radical commitment to the "Now."

      ## The No-Photo Policy
      By removing cameras, we restore freedom. When people know they aren't being watched, they truly dance. We've brought this philosophy to our events worldwide.

      ## Industrial Spaces, Human Beats
      There is a unique chemistry that happens when you put high-fidelity sound in a raw, concrete space. It strips away the pretension and leaves only the vibration.

      ## The Community of the Dancefloor
      On a Berlin dancefloor, rank and title disappear. It is perhaps the most democratic space on earth, where the only thing that matters is how you move to the kick drum.
    `,
        date: "Dec 10, 2025",
        readTime: "10 min read",
        category: "Nightlife",
        image: "https://images.unsplash.com/photo-1514525253361-b83a85f08a83?auto=format&fit=crop&w=1200&q=80",
        author: "Lukas Weber",
        authorRole: "Creative Director",
        authorAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?fit=crop&w=120&q=80"
    }
];

export default function BlogDetailPage() {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === Number(id)) || blogPosts[0];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Navbar />

            <main className="pb-24">
                {/* Article Header */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={post.image}
                            className="w-full h-full object-cover"
                            alt={post.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </motion.div>

                    <div className="relative h-full max-w-5xl mx-auto px-4 flex flex-col justify-end pb-16 pt-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Link
                                href="/blog"
                                className="group inline-flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-[0.2em] hover:text-white transition-all mb-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                    <ArrowLeft size={16} />
                                </div>
                                Back to Journal
                            </Link>

                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest">
                                    {post.category}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] py-4">
                                {post.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 pr-6">
                                    <div className="w-12 h-12 rounded-xl border-2 border-slate-900 overflow-hidden shrink-0">
                                        <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">{post.author}</p>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{post.authorRole}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <Calendar size={16} className="text-indigo-500" /> {post.date}
                                    </div>
                                    <div className="h-4 w-px bg-white/10" />
                                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <Clock size={16} className="text-indigo-500" /> {post.readTime}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Article Content */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-12 gap-20">
                        {/* Left Col: Sticky Sidebar */}
                        <aside className="lg:col-span-1 hidden lg:block">
                            <div className="sticky top-32 flex flex-col gap-8">
                                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 transition-all">
                                    <Heart size={20} />
                                </button>
                                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all">
                                    <MessageSquare size={20} />
                                </button>
                                <div className="h-10 w-px bg-white/10 mx-auto" />
                                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </aside>

                        {/* Middle Col: Content */}
                        <article className="lg:col-span-8">
                            <div className="prose prose-invert prose-2xl max-w-none 
                                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
                                prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-2xl prose-p:font-medium
                                prose-strong:text-white prose-strong:font-black
                                prose-em:text-indigo-400 prose-em:font-bold prose-em:not-italic
                                prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-10 prose-h2:text-indigo-50
                                prose-h1:text-5xl prose-h1:mb-12
                            ">
                                {/* Simulated Markdown Rendering */}
                                {post.content.split('\n').map((line, i) => {
                                    const trimmed = line.trim();
                                    if (trimmed.startsWith('# ')) return <h1 key={i} className="border-b border-white/5 pb-4">{trimmed.replace('# ', '')}</h1>;
                                    if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.replace('## ', '')}</h2>;
                                    if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.replace('### ', '')}</h3>;
                                    if (trimmed === '') return <br key={i} />;
                                    return <p key={i} className="mb-8">{trimmed}</p>;
                                })}
                            </div>

                            {/* Share Controls for Mobile */}
                            <div className="lg:hidden flex items-center gap-4 py-12 border-y border-white/5 my-12">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Share this story:</p>
                                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white"><Twitter size={18} /></button>
                                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white"><Facebook size={18} /></button>
                                <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white"><Linkedin size={18} /></button>
                            </div>

                            {/* Author Bio */}
                            <div className="mt-20 p-10 rounded-[3rem] bg-indigo-600/5 border border-indigo-500/20 flex flex-col md:flex-row gap-10 items-center">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-indigo-500/30 shrink-0">
                                    <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-4 text-center md:text-left">
                                    <div>
                                        <h4 className="text-2xl font-black text-white">{post.author}</h4>
                                        <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest">{post.authorRole}</p>
                                    </div>
                                    <p className="text-slate-400 font-medium">
                                        Helping people build deeper connections in a digital world. I explore the intersection of technology, culture, and human interaction.
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Right Col: Related / Sidebar */}
                        <aside className="lg:col-span-3 space-y-16">
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Trending Now</h4>
                                <div className="space-y-8">
                                    {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(p => (
                                        <Link key={p.id} href={`/blog/${p.id}`} className="group block space-y-3">
                                            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 bg-slate-900">
                                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.title} />
                                            </div>
                                            <h5 className="font-black text-white leading-tight group-hover:text-indigo-400 transition-colors">
                                                {p.title}
                                            </h5>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                {p.category} <ChevronRight size={10} />
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-pink-600 text-center space-y-6">
                                <h4 className="text-xl font-black text-white tracking-tight">Stay Inspired</h4>
                                <p className="text-xs font-bold text-white/70 leading-relaxed uppercase tracking-widest">Get the latest IRL trends delivered to your inbox.</p>
                                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-bold text-sm"
                                    />
                                    <button className="w-full py-3 rounded-full bg-white text-indigo-600 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                                        Join
                                    </button>
                                </form>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
