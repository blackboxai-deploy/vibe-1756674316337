'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user-store';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (isAuthenticated && user) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Welcome Section */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SimSuite
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Advanced Network Simulation Platform
            </p>
            <p className="text-gray-500 leading-relaxed">
              Build, simulate, and analyze complex network scenarios with our AI-powered platform. 
              Features 3D terrain mapping, real-time visualization, and comprehensive scenario management.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <h3 className="font-medium text-sm">3D Mapping</h3>
                  <p className="text-xs text-gray-500 mt-1">Cesium-powered terrain visualization</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-purple-600 rounded"></div>
                  </div>
                  <h3 className="font-medium text-sm">AI Generation</h3>
                  <p className="text-xs text-gray-500 mt-1">Intelligent scenario creation</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-green-600 rounded-lg"></div>
                  </div>
                  <h3 className="font-medium text-sm">Simulation</h3>
                  <p className="text-xs text-gray-500 mt-1">OPNET/MONET-style analysis</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                  </div>
                  <h3 className="font-medium text-sm">Playback</h3>
                  <p className="text-xs text-gray-500 mt-1">Timeline visualization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle>Welcome to SimSuite</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Demo credentials available upon request</p>
          </div>
        </div>
      </div>
    </div>
  );
}