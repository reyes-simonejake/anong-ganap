export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Anong Ganap? 🎉
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            AI-Powered Activity & Experience Planner
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Stop juggling multiple apps. Get complete itineraries with locations, routes, 
            costs, outfit suggestions, and personalized invitations — all in one place.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg transform hover:scale-105 transition">
            Start Planning Now
          </button>
        </div>

        {/* Activity Types */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center">
            <div className="text-5xl mb-3">💑</div>
            <h3 className="text-xl font-semibold mb-2">Date</h3>
            <p className="text-gray-600 text-sm">Plan romantic and memorable dates</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center">
            <div className="text-5xl mb-3">👥</div>
            <h3 className="text-xl font-semibold mb-2">Hangout</h3>
            <p className="text-gray-600 text-sm">Organize fun activities with friends</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center">
            <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold mb-2">Family</h3>
            <p className="text-gray-600 text-sm">Create family bonding experiences</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center">
            <div className="text-5xl mb-3">🧘</div>
            <h3 className="text-xl font-semibold mb-2">Solo</h3>
            <p className="text-gray-600 text-sm">Discover personal adventures</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Everything You Need in One Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Itinerary Generator</h3>
              <p className="text-gray-600">
                Get a complete timeline with activities, locations, and estimated costs based on your budget and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🌤️</div>
              <h3 className="text-xl font-semibold mb-2">Weather-Aware Planning</h3>
              <p className="text-gray-600">
                Automatic adjustments for weather conditions. Sunny? Outdoor spots. Rainy? Indoor alternatives.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Smart Transportation</h3>
              <p className="text-gray-600">
                Step-by-step routes with trains, buses, jeepneys, or ride-hailing options including time and cost estimates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">👔</div>
              <h3 className="text-xl font-semibold mb-2">Outfit Recommendations</h3>
              <p className="text-gray-600">
                Coordinated outfit suggestions for couples based on activity type, weather, and location vibe.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">💌</div>
              <h3 className="text-xl font-semibold mb-2">Invitation Generator</h3>
              <p className="text-gray-600">
                Create personalized invitations with activity details, dress code, and schedule. Share via email or link.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">Memory Archive</h3>
              <p className="text-gray-600">
                Save photos, notes, and visited locations to track your experiences over time.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start mb-8">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tell Us Your Plans</h3>
                <p className="text-gray-600">
                  Enter your budget, location, activity type, and preferred time. That's it!
                </p>
              </div>
            </div>

            <div className="flex items-start mb-8">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Creates Your Itinerary</h3>
                <p className="text-gray-600">
                  Our AI analyzes nearby attractions, weather, and your preferences to build a perfect plan.
                </p>
              </div>
            </div>

            <div className="flex items-start mb-8">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Complete Details</h3>
                <p className="text-gray-600">
                  Receive timeline, locations, routes, costs, outfit suggestions, and invitation — all ready to go.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Your Experience</h3>
                <p className="text-gray-600">
                  Follow your plan, create memories, and save them in your archive for future reference.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Itinerary Preview */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Sample Itinerary</h2>
          
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Café Date in Makati</h3>
                <p className="text-gray-600">Budget: ₱1,000 • Weather: Sunny ☀️</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="text-2xl font-bold text-indigo-600">₱950</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start border-l-4 border-indigo-600 pl-4 py-2">
                <div className="mr-4">
                  <p className="font-semibold text-indigo-600">3:00 PM</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Travel to Café</p>
                  <p className="text-sm text-gray-600">MRT to Ayala Station • ₱30 • 20 mins</p>
                </div>
              </div>

              <div className="flex items-start border-l-4 border-purple-600 pl-4 py-2">
                <div className="mr-4">
                  <p className="font-semibold text-purple-600">3:30 PM</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Coffee Break at The Curator</p>
                  <p className="text-sm text-gray-600">Specialty coffee & pastries • ₱400</p>
                </div>
              </div>

              <div className="flex items-start border-l-4 border-green-600 pl-4 py-2">
                <div className="mr-4">
                  <p className="font-semibold text-green-600">5:00 PM</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Ayala Triangle Gardens Walk</p>
                  <p className="text-sm text-gray-600">Photo spots & sunset viewing • Free</p>
                </div>
              </div>

              <div className="flex items-start border-l-4 border-orange-600 pl-4 py-2">
                <div className="mr-4">
                  <p className="font-semibold text-orange-600">6:30 PM</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Dinner at Wildflour Café</p>
                  <p className="text-sm text-gray-600">Casual dining • ₱500</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="font-semibold mb-2">Outfit Theme: Casual Minimalist</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Person A</p>
                  <p className="text-gray-600">White polo, denim jeans, white sneakers</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">Person B</p>
                  <p className="text-gray-600">Beige dress, white cardigan, white sneakers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Plan Your Next Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Stop wasting time on multiple apps. Let AI handle the planning.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg transform hover:scale-105 transition">
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Anong Ganap? • AI-Powered Activity Planner</p>
        </div>
      </footer>
    </div>
  );
}
