import React from 'react';
import { Palette, Gamepad2, Zap, Users, Heart } from 'lucide-react';
const dummyData = [
    {
      id: 1,
      title: 'Super Rare',
      description:
        'The future of CryptoArt markets - a network governed by artists, collectors, and curators.',
      image: 'https://picsum.photos/id/237/200/300',
      users: '299.5k',
      likes: '71.4K',
      tags: ['Art', 'Crypto', 'NFT'],
    },
    {
      id: 2,
      title: 'Crypto World',
      description:
        'A decentralized platform for creators and collectors to engage with blockchain-based art.',
      image: 'https://picsum.photos/id/238/200/300',
      users: '150k',
      likes: '35K',
      tags: ['Art', 'Crypto', 'Blockchain'],
    },
    {
      id: 3,
      title: 'Blockchain Art',
      description:
        'Experience the revolution of art through blockchain, where ownership is tracked and verified.',
      image: 'https://picsum.photos/id/239/200/300',
      users: '250k',
      likes: '50K',
      tags: ['Art', 'Blockchain', 'NFT'],
    },
    {
      id: 4,
      title: 'Digital Collectibles',
      description:
        'A new wave of digital collectibles that leverage blockchain to authenticate ownership.',
      image: 'https://picsum.photos/id/240/200/300',
      users: '400k',
      likes: '100K',
      tags: ['Art', 'Crypto', 'Collectibles'],
    },
    {
      id: 5,
      title: 'NFT Revolution',
      description:
        'NFTs are transforming the world of digital art, allowing creators to monetize their work in new ways.',
      image: 'https://picsum.photos/id/241/200/300',
      users: '500k',
      likes: '120K',
      tags: ['NFT', 'Crypto', 'Art'],
    },
    {
      id: 6,
      title: 'The Art Blockchain',
      description:
        'A platform dedicated to the intersection of fine art and blockchain technology.',
      image: 'https://picsum.photos/id/242/200/300',
      users: '300k',
      likes: '80K',
      tags: ['Art', 'Blockchain', 'Crypto'],
    },
  ];
  


function CardBox() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyData.map((item) => (
          <div
            key={item.id}
            className="relative bg-white shadow-lg rounded-[20px] overflow-hidden"
          >
        
            <div
              className="h-20 bg-cover bg-center rounded-t-[20px]"
              style={{ backgroundImage: `url(${item.image})` }}
            ></div>
    
            <div className="p-6  rounded-[20px] ">
              <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              <div className="flex gap-6 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <Users className="text-gray-600" size={16} />
                  <span className="font-semibold">{item.users}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="text-gray-600" size={16} />
                  <span className="font-semibold">{item.likes}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                {item.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 shadow-sm"
                  >
                    {tag === 'Art' && <Palette size={14} />}
                    {tag === 'Crypto' && <Gamepad2 size={14} />}
                    {tag === 'NFT' && <Zap size={14} />}
                    {tag === 'Blockchain' && <Zap size={14} />}
                    <span className="text-sm font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardBox;
