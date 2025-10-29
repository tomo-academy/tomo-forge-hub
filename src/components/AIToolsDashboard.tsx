import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  PieChart, 
  Activity,
  Sparkles,
  Loader2,
  BookOpen,
  Lightbulb,
  Users,
  Copy,
  Download,
  RefreshCw,
  Wand2,
  FileText,
  Video,
  Image as ImageIcon,
  Hash,
  MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIToolsDashboardProps {
  channelData?: {
    name: string;
    subscribers: string;
    views: string;
    growth: string;
  };
}

interface AIAnalysisResult {
  type: string;
  content: string;
  generatedAt: string;
}

interface ContentGenerationResult {
  title: string;
  description: string;
  script: string;
  thumbnail: string;
  tags: string[];
  hooks: string[];
  cta: string;
}

export const AIToolsDashboard: React.FC<AIToolsDashboardProps> = ({ channelData }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [generatedContent, setGeneratedContent] = useState<ContentGenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [customPrompt, setCustomPrompt] = useState('');

  const analysisTypes = [
    {
      id: 'overview',
      title: 'Channel Overview',
      description: 'Comprehensive channel performance analysis',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'insights',
      title: 'AI Insights',
      description: 'Deep learning-powered audience insights',
      icon: Brain,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'recommendations',
      title: 'Content Recommendations',
      description: 'Personalized content strategy suggestions',
      icon: Lightbulb,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'trends',
      title: 'Trending Analysis',
      description: 'Current market trends and opportunities',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'predictions',
      title: 'Growth Predictions',
      description: 'AI-powered growth forecasting',
      icon: Target,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'competitors',
      title: 'Competitor Analysis',
      description: 'Market positioning and competitive intelligence',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'content-strategy',
      title: 'Content Strategy',
      description: 'Long-term content planning framework',
      icon: FileText,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'growth-hacks',
      title: 'Growth Hacks',
      description: 'Rapid growth tactics and viral strategies',
      icon: Zap,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const contentTypes = [
    { id: 'tutorial', name: 'Tutorial', icon: BookOpen },
    { id: 'review', name: 'Tool Review', icon: Sparkles },
    { id: 'news', name: 'Tech News', icon: TrendingUp },
    { id: 'project', name: 'Project Build', icon: Activity },
    { id: 'interview', name: 'Interview', icon: MessageSquare },
    { id: 'shorts', name: 'Shorts Ideas', icon: Video },
    { id: 'series', name: 'Series Planning', icon: FileText },
    { id: 'trending', name: 'Trending Topics', icon: Hash }
  ];

  const generateAIAnalysis = (type: string) => {
    setLoading(true);
    setActiveTab(type);

    // Simulate AI analysis generation
    setTimeout(() => {
      const analysisContent = getAnalysisContent(type);
      setAnalysis({
        type,
        content: analysisContent,
        generatedAt: new Date().toISOString()
      });
      setLoading(false);
    }, 2000);
  };

  const generateContent = (contentType: string) => {
    setLoading(true);

    // Simulate content generation
    setTimeout(() => {
      const content = getGeneratedContent(contentType);
      setGeneratedContent(content);
      setLoading(false);
    }, 1500);
  };

  const getAnalysisContent = (type: string): string => {
    const contents: Record<string, string> = {
      overview: `# 📊 TOMO Academy Channel Overview Analysis

## Current Performance Metrics
- **Total Subscribers**: ${channelData?.subscribers || '185K'}
- **Monthly Views**: ${channelData?.views || '2.1M'}
- **Growth Rate**: ${channelData?.growth || '+18%'}
- **Engagement Rate**: 8.7% (Above Industry Average)

## Key Performance Indicators
- **Average View Duration**: 12:45 minutes
- **Click-Through Rate**: 6.2%
- **Subscriber Conversion**: 4.1%
- **Comment Engagement**: 2.3%

## Content Performance Breakdown
1. **Tutorial Videos**: 65% of total views
2. **Tech Reviews**: 20% of total views  
3. **Project Builds**: 15% of total views

## Audience Demographics
- **Primary Age Group**: 18-34 (72%)
- **Geographic Distribution**: India (45%), US (25%), Other (30%)
- **Peak Activity Times**: Tuesday-Thursday 2-4 PM IST

## Revenue Analytics
- **Estimated Monthly Revenue**: $8,500 - $12,000
- **RPM (Revenue per Mille)**: $3.20
- **Primary Revenue Sources**: AdSense (70%), Sponsorships (30%)`,

      insights: `# 🧠 Advanced AI Insights & Patterns

## Audience Behavior Analysis
Your audience shows **exceptional engagement** with technical content, particularly:

### High-Performing Content Patterns
- **Long-form tutorials** (30+ minutes) get 40% higher retention
- **Code-along projects** generate 3x more comments
- **"Real-world examples"** in titles increase CTR by 25%

### Optimal Publishing Strategy
- **Best Upload Days**: Tuesday, Wednesday, Thursday
- **Optimal Time**: 2:00 PM - 4:00 PM IST
- **Frequency**: 3-4 videos per week maintains peak engagement

## Engagement Optimization
### Title Patterns That Work
- "Complete Guide to [Technology]" - 85% success rate
- "Build a [Project] with [Technology]" - 78% success rate  
- "Top [Number] [Category] in 2025" - 72% success rate

### Thumbnail Performance
- **High-contrast backgrounds** increase CTR by 35%
- **Code screenshots** with arrows perform 40% better
- **Face visibility** improves recognition by 28%

## Content Gaps & Opportunities
1. **AI/ML Content**: High demand, low competition
2. **Web3 Development**: Emerging trend, early adopter advantage
3. **DevOps Tutorials**: Consistent high search volume
4. **Mobile Development**: Growing audience segment`,

      recommendations: `# 💡 Personalized Content Recommendations

## Immediate Action Items (Next 30 Days)

### High-Priority Content Ideas
1. **"React 19 New Features Complete Guide"**
   - Estimated Views: 80K-120K
   - Competition: Medium
   - Trending Score: 9/10

2. **"Build a Full-Stack AI Chat App"**
   - Estimated Views: 95K-140K
   - Competition: Low
   - Trending Score: 10/10

3. **"Node.js Performance Optimization"**
   - Estimated Views: 60K-85K
   - Competition: Medium
   - Trending Score: 7/10

## Content Series Opportunities
### "Complete DevOps Mastery 2025"
- **8-part series** covering Docker, Kubernetes, CI/CD
- **Estimated Total Views**: 500K-700K
- **Revenue Potential**: $3,000-$5,000

### "AI Tools for Developers"
- **12-part series** reviewing latest AI development tools
- **Sponsor Potential**: High (AI companies actively sponsoring)
- **Estimated Revenue**: $8,000-$12,000

## Collaboration Recommendations
- **Guest Interviews**: Top 5 React developers
- **Code Reviews**: Popular open-source projects
- **Live Coding**: Weekly streams for community building

## SEO Optimization Strategy
- Target **long-tail keywords** with 1K-10K monthly searches
- Create **tutorial playlists** for better session duration
- Optimize **end screens** for 15% better subscriber conversion`,

      trends: `# 📈 Current Trends & Market Analysis

## Technology Trends (2025)
### 🚀 Rapidly Growing
1. **AI Development Tools** (+340% search interest)
   - GitHub Copilot alternatives
   - AI-powered debugging tools
   - Code generation platforms

2. **Web3 & Blockchain** (+210% search interest)
   - Smart contract development
   - DeFi protocols
   - NFT marketplace creation

3. **Edge Computing** (+180% search interest)
   - Serverless architectures
   - CDN optimization
   - Real-time applications

### 📊 Stable High-Demand
- **React/Next.js Development** (Consistent 50K+ monthly searches)
- **Node.js Backend Development** (Consistent 35K+ monthly searches)
- **Database Design & Optimization** (Growing 15% annually)

## Content Opportunity Analysis
### High Opportunity, Low Competition
1. **"Supabase vs Firebase 2025"** - 12K searches, 3 competitors
2. **"Bun.js Complete Tutorial"** - 8K searches, 2 quality videos
3. **"Serverless AI Applications"** - 15K searches, 5 competitors

### Trending Tutorial Formats
- **"Build and Deploy in 30 Minutes"** (+45% engagement)
- **"From Beginner to Pro"** series (+60% subscriber retention)
- **"Real Project Walkthroughs"** (+35% completion rate)

## Seasonal Trends
- **January**: "New Year, New Skills" content performs 200% better
- **September**: Back-to-school coding bootcamp content peaks
- **Q4**: Year-end review and prediction content gets high engagement`,

      predictions: `# 🎯 AI-Powered Growth Predictions

## 6-Month Growth Forecast

### Subscriber Growth Prediction
- **Current**: ${channelData?.subscribers || '185K'}
- **3 Months**: 285K-320K subscribers
- **6 Months**: 420K-480K subscribers
- **Confidence Level**: 87%

### Revenue Projections
- **Month 1-2**: $12K-$15K/month
- **Month 3-4**: $18K-$22K/month  
- **Month 5-6**: $25K-$32K/month
- **Annual Target**: $240K-$300K

## Growth Acceleration Factors
### Content Strategy Impact
- **Consistent Upload Schedule**: +35% growth rate
- **Series-Based Content**: +28% retention
- **Community Engagement**: +42% subscriber loyalty

### Market Timing Opportunities
1. **AI Content Boom** (Next 8 months)
   - Early adopter advantage
   - High sponsor interest
   - Premium ad rates

2. **Web3 Education Gap** (Next 12 months)
   - Limited quality content creators
   - High-value audience
   - Enterprise training opportunities

## Success Probability Matrix
- **Reach 250K subscribers by Q1 2026**: 92%
- **Hit 500K subscribers by Q3 2026**: 78%
- **Achieve $30K monthly revenue**: 85%
- **Secure major sponsor partnerships**: 94%

## Risk Mitigation Strategies
- **Diversify Platform Presence**: Expand to LinkedIn, Twitter
- **Build Email List**: 15K+ subscribers for direct communication
- **Create Premium Content**: Paid courses for revenue stability`,

      competitors: `# 🏆 Competitive Intelligence Analysis

## Direct Competitors Analysis

### Primary Competitors
1. **Code with Mosh** (2.8M subscribers)
   - **Strengths**: Professional presentation, structured courses
   - **Weaknesses**: Less frequent uploads, higher price point
   - **Opportunity**: More accessible, beginner-friendly content

2. **Traversy Media** (2.1M subscribers)  
   - **Strengths**: Consistent uploads, trending tech coverage
   - **Weaknesses**: Less depth in advanced topics
   - **Opportunity**: Deep-dive technical content

3. **The Net Ninja** (1.2M subscribers)
   - **Strengths**: Clear explanations, good beginner content
   - **Weaknesses**: Dated design, slower adaptation to new tech
   - **Opportunity**: Modern UI/UX, cutting-edge technologies

## Market Positioning
### Your Competitive Advantages
- **Indian Tech Perspective**: Unique viewpoint for global audience
- **Real-world Projects**: Practical, industry-applicable content
- **Community Focus**: Strong engagement and interaction

### Market Gaps You Can Fill
1. **AI-First Development**: Limited quality content available
2. **Indian Startup Tech Stack**: Underserved niche with high demand
3. **Regional Language Subtitles**: Massive untapped audience

## Content Differentiation Strategy
### Blue Ocean Opportunities
- **Live Problem-Solving**: Debug real user issues on stream
- **Industry Case Studies**: Tech solutions from successful startups
- **Career Guidance**: Tech career advice specific to Indian market

### Collaboration Potential
- **Cross-channel collaborations** with complementary tech channels
- **Industry expert interviews** with startup founders
- **Open source project contributions** with documentation videos`,

      'content-strategy': `# 📝 Comprehensive Content Strategy Framework

## 90-Day Content Calendar

### Month 1: Foundation & Trending Tech
**Week 1-2**: React 19 & Next.js 15 Features
- "React 19: Complete Feature Breakdown"
- "Next.js 15: App Router Deep Dive" 
- "Migration Guide: React 18 to 19"

**Week 3-4**: AI Development Tools
- "Top 10 AI Coding Tools in 2025"
- "Build with GitHub Copilot: Complete Guide"
- "AI-Powered Debugging Techniques"

### Month 2: Full-Stack Project Series
**Week 5-8**: "Build a Modern SaaS Application"
- Part 1: Project Setup & Architecture
- Part 2: Authentication & User Management  
- Part 3: Database Design & API Development
- Part 4: Frontend with React & TypeScript
- Part 5: Payment Integration & Deployment

### Month 3: Advanced Topics & Community
**Week 9-10**: Performance & Optimization
- "React Performance: Advanced Optimization"
- "Node.js Scaling: From 0 to 1M Users"

**Week 11-12**: Community & Live Content  
- "Live Coding: Viewer Requested Projects"
- "Code Review: Community Submissions"

## Content Pillar Strategy
### Primary Pillars (70% of content)
1. **Tutorial Content** (40%)
   - Step-by-step guides
   - Technology deep-dives
   - Best practices

2. **Project-Based Learning** (30%)
   - Complete application builds
   - Real-world implementations
   - Portfolio projects

### Secondary Pillars (30% of content)
3. **Industry Insights** (15%)
   - Tech trend analysis
   - Career advice  
   - Industry interviews

4. **Community Content** (15%)
   - Q&A sessions
   - Code reviews
   - Live streams

## Engagement Optimization
### Thumbnail Strategy
- **Consistent Branding**: TOMO Academy colors and fonts
- **Clear Hierarchy**: Title > Technology logo > Preview image
- **A/B Testing**: Test 3 thumbnail variants per video

### Title Optimization Framework
- **Primary Keyword** + **Benefit** + **Year/Version**
- Examples: "Master React Hooks in 2025", "Build Full-Stack Apps with Next.js 15"`,

      'growth-hacks': `# ⚡ Rapid Growth Hacks & Viral Strategies

## Immediate Implementation (This Week)

### 1. Community-Driven Content
**Strategy**: "Code Challenge Wednesdays"
- Post coding challenges every Wednesday
- Feature best solutions in follow-up videos
- **Expected Growth**: +25% engagement, +15% new subscribers

### 2. Cross-Platform Amplification
**Strategy**: "YouTube → Twitter → LinkedIn" pipeline
- Create Twitter threads summarizing video content
- Post LinkedIn articles with detailed explanations
- **Expected Growth**: +40% external traffic

### 3. Collaboration Acceleration
**Strategy**: "Tech Talk Fridays"
- Weekly collaborations with other developers
- Guest appearances on podcasts/streams
- **Expected Growth**: +60% audience crossover

## Advanced Growth Tactics

### Viral Content Formula
**"Build [Popular App] Clone in [Time]"**
- Examples: "Build TikTok in 24 hours", "Create ChatGPT clone in 4 hours"
- **Success Rate**: 80% chance of 100K+ views
- **Preparation**: 2-3 days of pre-planning required

### SEO Growth Hack
**"Tutorial + Cheat Sheet" Combination**
- Create comprehensive tutorials
- Offer downloadable cheat sheets/resources
- Build email list for direct marketing
- **Expected Growth**: +35% subscriber retention

### Community Building Hack
**"TOMO Academy Discord Server"**
- Create exclusive Discord community
- Weekly office hours and Q&A
- Member-only content previews
- **Expected Growth**: +50% community engagement

## Revenue Acceleration

### Premium Content Strategy
**"TOMO Academy Pro"**
- Advanced tutorials and courses
- 1-on-1 mentoring sessions  
- Private Discord channel access
- **Revenue Potential**: $5K-$10K/month additional

### Sponsorship Optimization
**"Integrated Product Reviews"**
- Seamlessly integrate sponsored content
- Genuine product testing and feedback
- Long-term partnership focus
- **Revenue Potential**: $15K-$25K/month

## Metrics & Tracking
### Key Growth Metrics
- **Weekly Subscriber Growth**: Target 2,500-3,500
- **Engagement Rate**: Maintain above 8%
- **External Traffic**: Increase by 45%
- **Email List Growth**: 200-300 subscribers/week

### Success Indicators
- **Viral Video**: 1 video with 200K+ views per month
- **Cross-Platform Growth**: 25% of traffic from external sources
- **Community Size**: 5K+ Discord members by Q2 2025`
    };

    return contents[type] || 'Analysis content not available.';
  };

  const getGeneratedContent = (contentType: string): ContentGenerationResult => {
    const contents: Record<string, ContentGenerationResult> = {
      tutorial: {
        title: "Master React Server Components in 2025: Complete Guide",
        description: "Learn React Server Components from scratch with hands-on examples, best practices, and real-world implementations. Perfect for developers looking to build faster, more efficient React applications.",
        script: `# React Server Components Complete Tutorial Script

## Hook (0:00 - 0:30)
"What if I told you that you could make your React apps 70% faster and reduce your bundle size by half? That's exactly what React Server Components can do, and in this video, I'll show you everything you need to know."

## Introduction (0:30 - 1:30)
- Welcome to TOMO Academy
- What we'll cover today
- Prerequisites and setup

## Section 1: Understanding Server Components (1:30 - 5:00)
- What are Server Components?
- Difference between SSR and Server Components
- Benefits and use cases
- Live demonstration

## Section 2: Setting Up Your Environment (5:00 - 8:00)
- Next.js 15 setup
- Project structure
- Configuration

## Section 3: Building Your First Server Component (8:00 - 15:00)
- Creating a data-fetching component
- Streaming with Suspense
- Error handling

## Section 4: Advanced Patterns (15:00 - 25:00)
- Server and Client component composition
- Prop drilling solutions
- Performance optimization

## Section 5: Real-World Example (25:00 - 35:00)
- Building a blog with Server Components
- Database integration
- Deployment considerations

## Conclusion & Next Steps (35:00 - 38:00)
- Recap of key concepts
- Resources for further learning
- Next video preview`,
        thumbnail: "High-contrast design with React logo, server icon, and code preview. Include 'COMPLETE GUIDE' badge and TOMO Academy branding.",
        tags: ["React", "Server Components", "Next.js", "Tutorial", "JavaScript", "Web Development", "Performance", "SSR"],
        hooks: [
          "This React feature will change how you build apps forever",
          "React Server Components explained in 5 minutes",
          "Why every React developer needs to learn this NOW"
        ],
        cta: "If this tutorial helped you understand React Server Components, make sure to subscribe for more advanced React content. Drop a comment below with your experience using Server Components!"
      },
      review: {
        title: "Top 10 AI Coding Tools That Will Replace Developers in 2025",
        description: "Comprehensive review of the latest AI coding tools including GitHub Copilot, Cursor, Replit AI, and more. See which tools actually work and which ones are just hype.",
        script: `# AI Coding Tools Review Script

## Hook (0:00 - 0:20)
"I tested 15 AI coding tools so you don't have to. Here are the top 10 that might actually replace some developers."

## Introduction (0:20 - 1:00)
- Testing methodology
- Criteria for evaluation
- What to expect

## Tool Reviews (1:00 - 18:00)
### 1. GitHub Copilot (1:00 - 2:30)
- Features and capabilities
- Pricing and availability
- Pros and cons
- Live demonstration

### 2. Cursor AI (2:30 - 4:00)
- Unique features
- Comparison with Copilot
- Real-world usage

[Continue for all 10 tools]

## Final Verdict (18:00 - 20:00)
- Best tool for beginners
- Best for experienced developers
- Value for money recommendations`,
        thumbnail: "Split-screen showing code being written by AI vs human, with tool logos and rating stars. Include 'HONEST REVIEW' badge.",
        tags: ["AI Tools", "GitHub Copilot", "Coding", "Review", "Developer Tools", "Productivity", "Programming", "2025"],
        hooks: [
          "This AI tool wrote better code than me",
          "I let AI build an entire app - here's what happened",
          "The brutal truth about AI coding tools"
        ],
        cta: "Which AI coding tool do you use? Let me know in the comments! Subscribe for more honest tech reviews and tutorials."
      }
    };

    return contents[contentType] || contents.tutorial;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Content copied to clipboard');
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          AI Tools Dashboard
        </h2>
        <p className="text-muted-foreground">
          Comprehensive AI-powered analytics and content generation for TOMO Academy
        </p>
      </div>

      {/* Channel Stats */}
      {channelData && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{channelData.subscribers}</div>
                <div className="text-sm text-muted-foreground">Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{channelData.views}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{channelData.growth}</div>
                <div className="text-sm text-muted-foreground">Growth Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">8.7%</div>
                <div className="text-sm text-muted-foreground">Engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-8">
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="content-generator">Content Generator</TabsTrigger>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="tools">AI Tools</TabsTrigger>
        </TabsList>

        {/* AI Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysisTypes.map((type) => (
              <Card 
                key={type.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                onClick={() => generateAIAnalysis(type.id)}
              >
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-3`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{type.title}</h3>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analysis Results */}
          {(loading || analysis) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Analysis Results
                  </CardTitle>
                  {analysis && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(analysis.content)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mr-3" />
                    <span>Generating AI analysis...</span>
                  </div>
                ) : analysis ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysis.content}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Content Generator Tab */}
        <TabsContent value="content-generator" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => generateContent(type.id)}
              >
                <type.icon className="w-6 h-6" />
                <span className="text-sm">{type.name}</span>
              </Button>
            ))}
          </div>

          {/* Custom Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Custom Content Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe the content you want to generate..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
              <Button onClick={() => generateContent('custom')} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Custom Content
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content Results */}
          {(loading || generatedContent) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Generated Content Package
                  </CardTitle>
                  {generatedContent && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy All
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mr-3" />
                    <span>Generating content package...</span>
                  </div>
                ) : generatedContent ? (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid grid-cols-5">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="script">Script</TabsTrigger>
                      <TabsTrigger value="seo">SEO</TabsTrigger>
                      <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
                      <TabsTrigger value="marketing">Marketing</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Title</h3>
                        <p className="bg-muted p-3 rounded-lg">{generatedContent.title}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="bg-muted p-3 rounded-lg">{generatedContent.description}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="script">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {generatedContent.script}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="seo" className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="thumbnail">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Thumbnail Design Brief</h3>
                        <p>{generatedContent.thumbnail}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="marketing" className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Viral Hooks</h3>
                        <ul className="space-y-2">
                          {generatedContent.hooks.map((hook, index) => (
                            <li key={index} className="bg-muted p-3 rounded-lg">{hook}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Call to Action</h3>
                        <p className="bg-muted p-3 rounded-lg">{generatedContent.cta}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : null}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Smart Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <TrendingUp className="w-5 h-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Rate</span>
                    <Badge variant="default" className="bg-green-600">+23%</Badge>
                  </div>
                  <Progress value={87} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Your content engagement is 40% above industry average
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Target className="w-5 h-5" />
                  Growth Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">450K</div>
                  <div className="text-sm text-muted-foreground">Projected subscribers by Q2 2025</div>
                  <Progress value={78} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    87% probability of reaching target
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Sparkles className="w-5 h-5" />
                  Content Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs bg-purple-100 dark:bg-purple-900 p-2 rounded">
                    "React 19 Features" - High demand
                  </div>
                  <div className="text-xs bg-purple-100 dark:bg-purple-900 p-2 rounded">
                    "AI Development Tools" - Trending
                  </div>
                  <div className="text-xs bg-purple-100 dark:bg-purple-900 p-2 rounded">
                    "Next.js 15 Tutorial" - Low competition
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>Real-time performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Video Performance Score</span>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                  <Progress value={94} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Your videos consistently outperform 85% of similar channels
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Automation Tools
                </CardTitle>
                <CardDescription>Streamline your content creation workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Auto-generate descriptions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Hash className="w-4 h-4 mr-2" />
                    Smart tag suggestions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Thumbnail optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIToolsDashboard;