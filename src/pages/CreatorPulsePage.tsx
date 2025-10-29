import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Youtube, 
  Video, 
  BarChart3, 
  Upload, 
  TrendingUp, 
  Users, 
  Calendar,
  Brain,
  Sparkles,
  Target,
  ExternalLink,
  Play,
  Activity
} from 'lucide-react';
import { EnhancedVideoUpload } from '@/components/EnhancedVideoUpload';
import { ProgressTrackingDashboard } from '@/components/ProgressTrackingDashboard';
import { SEO } from '@/components/SEO';

const CreatorPulsePage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('dashboard');

  const features = [
    {
      id: 'dashboard',
      title: 'Analytics Dashboard',
      description: 'Real-time YouTube analytics and AI insights',
      icon: BarChart3,
      color: 'bg-blue-500',
      stats: '8+ AI Analysis Types'
    },
    {
      id: 'upload',
      title: 'Video Upload & Management',
      description: 'Advanced video project management with team assignments',
      icon: Upload,
      color: 'bg-green-500',
      stats: 'Team Collaboration'
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      description: 'Monitor video production progress and team performance',
      icon: Activity,
      color: 'bg-purple-500',
      stats: 'Real-time Updates'
    },
    {
      id: 'ai-tools',
      title: 'AI Content Tools',
      description: 'AI-powered content generation and optimization',
      icon: Brain,
      color: 'bg-orange-500',
      stats: 'GPT-4 Powered'
    }
  ];

  const channelStats = [
    { name: 'TOMO Academy', subscribers: '185K', views: '2.1M', growth: '+18%' }
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Creator Pulse Analytics</h2>
                <p className="text-muted-foreground">Integrated YouTube analytics with AI insights</p>
              </div>
              <Button 
                onClick={() => window.open('http://localhost:8080', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Full Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {channelStats.map((channel) => (
                <Card key={channel.name}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{channel.name}</h3>
                        <Badge variant="outline" className={`text-xs ${
                          parseFloat(channel.growth.replace('%', '').replace('+', '')) > 15 
                            ? 'text-green-600 border-green-200' 
                            : 'text-blue-600 border-blue-200'
                        }`}>
                          {channel.growth}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Subscribers</span>
                          <span className="font-medium">{channel.subscribers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Views</span>
                          <span className="font-medium">{channel.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Engagement up 23% this month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Optimal upload time: Tues 2PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Trending: React tutorials +89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Target className="w-5 h-5" />
                    Growth Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">3 Month Target</span>
                      <span className="font-semibold">450K subs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Projected Revenue</span>
                      <span className="font-semibold">$15K/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Success Probability</span>
                      <span className="font-semibold text-green-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    Content Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-xs bg-purple-100 dark:bg-purple-900 p-2 rounded">
                      "Web3 Development Tutorial"
                    </div>
                    <div className="text-xs bg-purple-100 dark:bg-purple-900 p-2 rounded">
                      "AI Tools for Developers 2024"
                    </div>
                    <div className="text-xs bg-purple-100 dark:bg-purple-900 p-2 rounded">
                      "React 19 New Features"
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key features and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setActiveFeature('upload')}
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Upload Video</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setActiveFeature('progress')}
                  >
                    <Activity className="w-6 h-6" />
                    <span className="text-sm">Track Progress</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setActiveFeature('ai-tools')}
                  >
                    <Brain className="w-6 h-6" />
                    <span className="text-sm">AI Tools</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => window.open('http://localhost:8080', '_blank')}
                  >
                    <ExternalLink className="w-6 h-6" />
                    <span className="text-sm">Full Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'upload':
        return <EnhancedVideoUpload />;
        
      case 'progress':
        return <ProgressTrackingDashboard />;
        
      case 'ai-tools':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">AI Content Tools</h2>
              <p className="text-muted-foreground mb-6">
                Access the full AI content generation suite in the integrated Creator Pulse dashboard
              </p>
              <Button 
                size="lg"
                onClick={() => window.open('http://localhost:8080', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open AI Tools Dashboard
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Content Generator
                  </CardTitle>
                  <CardDescription>AI-powered video ideas and scripts</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Complete video scripts</li>
                    <li>• SEO-optimized titles and descriptions</li>
                    <li>• Thumbnail design suggestions</li>
                    <li>• Viral hooks and CTAs</li>
                    <li>• Content calendar planning</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Analytics AI
                  </CardTitle>
                  <CardDescription>Advanced performance insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Growth predictions</li>
                    <li>• Competitor analysis</li>
                    <li>• Trend identification</li>
                    <li>• Revenue optimization</li>
                    <li>• Audience insights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <SEO 
        title="Creator Pulse - AI-Powered YouTube Analytics | TOMO Academy"
        description="Advanced YouTube analytics dashboard with AI insights, video management, and team collaboration tools for content creators."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TOMO Creator Pulse
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive YouTube analytics and content management platform powered by AI. 
            Monitor performance, manage video projects, and optimize your content strategy.
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeFeature === feature.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center text-white`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {feature.description}
                    </p>
                    <Badge variant="outline" className="text-xs mt-2">
                      {feature.stats}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Content */}
        <div className="bg-card rounded-lg border p-6">
          {renderFeatureContent()}
        </div>

        {/* Integration Info */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                <Youtube className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Integrated Creator Ecosystem</h3>
                <p className="text-muted-foreground mb-4">
                  Creator Pulse is seamlessly integrated with the TOMO Academy platform, providing 
                  unified project management, team collaboration, and real-time analytics for our 
                  entire creator network.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Real-time Analytics</Badge>
                  <Badge variant="secondary">Team Collaboration</Badge>
                  <Badge variant="secondary">AI-Powered Insights</Badge>
                  <Badge variant="secondary">Project Management</Badge>
                  <Badge variant="secondary">Content Optimization</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorPulsePage;