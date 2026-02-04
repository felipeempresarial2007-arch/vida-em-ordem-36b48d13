import { useState } from 'react';
import AdminAmbassadorPanel from '@/components/admin/AdminAmbassadorPanel';
import InviteCodeManager from '@/components/admin/InviteCodeManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Ticket } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="ambassadors" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ambassadors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Embaixadores
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Convites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ambassadors" className="mt-6">
          <AdminAmbassadorPanel />
        </TabsContent>
        
        <TabsContent value="invites" className="mt-6">
          <InviteCodeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
