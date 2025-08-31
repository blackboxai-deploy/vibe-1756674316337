'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    description: 'Overview and quick actions',
  },
  {
    name: 'Scenarios',
    href: '/dashboard/scenarios',
    description: 'Manage simulation scenarios',
  },
  {
    name: 'Create Scenario',
    href: '/dashboard/scenarios/create',
    description: '3D scenario editor',
  },
  {
    name: 'Simulations',
    href: '/dashboard/simulations',
    description: 'Run and manage simulations',
  },
  {
    name: 'Playback',
    href: '/dashboard/playback',
    description: 'Replay simulation results',
  },
  {
    name: 'Templates',
    href: '/dashboard/templates',
    description: 'Scenario templates library',
  },
  {
    name: 'Regression',
    href: '/dashboard/regression',
    description: 'Testing and validation',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SimSuite</h1>
              <p className="text-xs text-gray-500">Network Simulation</p>
            </div>
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100"
        >
          <div className="w-4 h-4 flex flex-col justify-center space-y-0.5">
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
          </div>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100',
                      collapsed && 'justify-center'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      isActive ? 'bg-blue-600' : 'bg-gray-400'
                    )}></div>
                    
                    {!collapsed && (
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>

      {!collapsed && (
        <>
          <Separator />
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                AI Scenario Generator
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Generate complex scenarios using natural language
              </p>
              <Button size="sm" className="w-full">
                Generate Scenario
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}