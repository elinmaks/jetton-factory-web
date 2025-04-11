
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Sparkles } from 'lucide-react';

// Mock data for NFT collections
const nftCollections = [
  {
    id: 1,
    name: "TON Punks",
    items: 1000,
    floor: 12.5,
    verified: true,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "TON Bears",
    items: 500,
    floor: 8.7,
    verified: true,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Cyber Demons",
    items: 750,
    floor: 5.3,
    verified: false,
    image: "/placeholder.svg"
  }
];

const NFTCollections = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nftCollections.map((collection) => (
        <Card 
          key={collection.id} 
          className="bg-ton-card border-ton-blue/20 overflow-hidden hover:border-ton-blue/50 transition-all duration-300"
        >
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ton-background/90" />
            <img 
              src={collection.image} 
              alt={collection.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-3 flex items-center">
              <span className="text-white font-medium">{collection.name}</span>
              {collection.verified && (
                <BadgeCheck className="h-4 w-4 ml-1 text-ton-blue" />
              )}
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-gray-400">Items</div>
                <div className="text-white font-medium">{collection.items}</div>
              </div>
              <div>
                <div className="text-gray-400">Floor</div>
                <div className="text-white font-medium">{collection.floor} TON</div>
              </div>
              <div>
                <div className="text-gray-400">Status</div>
                <div className="text-ton-success font-medium">Live</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-ton-blue/50 text-ton-blue hover:bg-ton-blue/10">
              <Sparkles className="h-4 w-4 mr-2" />
              View Collection
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NFTCollections;
