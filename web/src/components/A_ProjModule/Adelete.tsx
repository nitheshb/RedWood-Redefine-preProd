import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Handpicked Jewellery Designs from Goldsmith',
    date: 'December 4, 2024',
    location: 'HSR layout, Bangalore',
    price: '11,111',
    imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed',
    category: 'JEWELLERY',
  },
  {
    id: 2,
    title: 'Healthy Delicious Food',
    date: 'December 4, 2024',
    location: 'Outer Ring Road, Bangalore',
    price: '11,111',
    imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826',
    category: 'FOOD',
  },
  {
    id: 3,
    title: 'Trendy Designer Wear with an Extensive Collection of Clothing Options',
    date: 'December 4, 2024',
    location: 'Vijayanagar, Bangalore',
    price: '11,111',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    category: 'FASHION',
  },
];

function AppBox() {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const filters = ['All', 'Upcoming', 'Completed', 'Ongoing'];

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
   
        <div className="mb-8 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-normal  text-[#2BC2F6] mb-6">All Events</h1>
          <div className="flex gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow h-auto"
            >
        
              <div className="relative">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 right-4 bg-[#31C0F0] text-white px-3 py-2 rounded-[10px] text-sm font-medium">
                  {event.category}
                </span>
              </div>


              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#484848] mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center font-semibold text-[#484848]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center font-semibold text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-[#484848]"  />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

         
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-baseline bg-[#F5FCFE] justify-between">
                  <div className="flex items-baseline ml-3">
                    <span className="text-[#000000]">₹</span>
                    <span className="text-[#000000] font-bold text-[18px] ml-1">{event.price}</span>
                    <span className="text-[#000000] text-[18px] ml-1">onwards</span>
                  </div>
                  <button className="text-[#000000] px-4 py-2 rounded text-[16px] font-normal  transition-colors border-l-[3px] border-[#31C0F0] h-full flex items-center">
                   BOOK NOW
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppBox;
