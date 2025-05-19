"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, X, ChevronDown } from "lucide-react"

// Define types for regions and towns
type Town = {
  name: string
  region: string
}

type Region = {
  name: string
  capital: string
  towns: string[]
}

// Namibia regions data
const namibiaRegions: Region[] = [
  {
    name: "Zambezi Region",
    capital: "Katima Mulilo",
    towns: ["Katima Mulilo", "Kongola", "Sibbinda", "Linyanti", "Isize", "Bukalo", "Sangwali", "Mafwe"],
  },
  {
    name: "Ohangwena Region",
    capital: "Eenhana",
    towns: ["Eenhana", "Okongo", "Omungwelume", "Oshikango", "Epembe", "Engela", "Oshihengua", "Ohangwena"],
  },
  {
    name: "Omusati Region",
    capital: "Outapi",
    towns: ["Outapi", "Oshikuku", "Ruacana", "Okahao", "Elim", "Tsandi", "Ongwediva", "Ogongo", "Okalongo"],
  },
  {
    name: "Oshana Region",
    capital: "Oshakati",
    towns: ["Oshakati", "Ongwediva", "Ondangwa", "Okatana", "Onamulunga", "Oshikango", "Ongha", "Uukwiyu"],
  },
  {
    name: "Oshikoto Region",
    capital: "Tsumeb",
    towns: ["Tsumeb", "Oniipa", "Omuthiya", "Onyaanya", "Guinas", "Oshikoto", "Okankolo", "Onayena"],
  },
  {
    name: "Kunene Region",
    capital: "Opuwo",
    towns: [
      "Opuwo",
      "Kamanjab",
      "Outjo",
      "Epupa",
      "Sesfontein",
      "Orupembe",
      "Omatjete",
      "Opuwo West",
      "Puros",
      "Okangwati",
    ],
  },
  {
    name: "Otjozondjupa Region",
    capital: "Otjiwarongo",
    towns: [
      "Otjiwarongo",
      "Grootfontein",
      "Okakarara",
      "Otavi",
      "Otjinene",
      "Kalkfeld",
      "Okahandja",
      "Otjiuana",
      "Okondjatu",
    ],
  },
  {
    name: "Kavango East Region",
    capital: "Rundu",
    towns: ["Rundu", "Ndiyona", "Mukwe", "Mashare", "Ndonga Linena", "Linyanti", "Sangwali"],
  },
  {
    name: "Kavango West Region",
    capital: "Nkurenkuru",
    towns: ["Nkurenkuru", "Mpungu", "Kaisosi", "Kahenge"],
  },
  {
    name: "Hardap Region",
    capital: "Mariental",
    towns: [
      "Mariental",
      "Rehoboth",
      "Gibeon",
      "Maltahöhe",
      "Leonardville",
      "Stampriet",
      "Uhlenhorst",
      "Dordabis",
      "Kalkrand",
    ],
  },
  {
    name: "Karas Region",
    capital: "Keetmanshoop",
    towns: ["Keetmanshoop", "Lüderitz", "Karasburg", "Oranjemund", "Bethanie", "Aus", "Koës", "Ariamsvlei", "Seeheim"],
  },
  {
    name: "Erongo Region",
    capital: "Walvis Bay",
    towns: ["Walvis Bay", "Swakopmund", "Omaruru", "Usakos", "Arandis", "Henties Bay", "Okahandja"],
  },
  {
    name: "Khomas Region",
    capital: "Windhoek",
    towns: ["Windhoek", "Okahandja", "Khomasdal", "Katutura", "Goreangab", "Klein Windhoek"],
  },
]

// Flatten all towns with their regions for search
const allTowns: Town[] = namibiaRegions.flatMap((region) =>
  region.towns.map((town) => ({ name: town, region: region.name })),
)

interface LocationSelectorProps {
  onRegionChange?: (region: string) => void
  onTownChange?: (town: string, region: string) => void
  defaultRegion?: string
  defaultTown?: string
  label?: string
  placeholder?: string
  className?: string
}

export function LocationSelector({
  onRegionChange,
  onTownChange,
  defaultRegion = "",
  defaultTown = "",
  label = "Location",
  placeholder = "Search for your region or town",
  className = "",
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState(defaultRegion)
  const [selectedTown, setSelectedTown] = useState(defaultTown)
  const [customLocation, setCustomLocation] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter regions and towns based on search term
  const filteredRegions = namibiaRegions.filter((region) =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTowns = allTowns.filter((town) => town.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle region selection
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
    setSelectedTown("")
    setIsOpen(false)
    setSearchTerm("")

    if (onRegionChange) {
      onRegionChange(region)
    }
  }

  // Handle town selection
  const handleTownSelect = (town: string, region: string) => {
    setSelectedTown(town)
    setSelectedRegion(region)
    setIsOpen(false)
    setSearchTerm("")

    if (onTownChange) {
      onTownChange(town, region)
    }
  }

  // Handle custom location submission
  const handleCustomLocationSubmit = () => {
    if (customLocation.trim()) {
      setSelectedTown(customLocation)
      setIsOpen(false)
      setSearchTerm("")
      setShowCustomInput(false)

      if (onTownChange) {
        onTownChange(customLocation, selectedRegion)
      }

      // In a real app, you would notify admin about the new location
      console.log("New location added:", customLocation, "in region:", selectedRegion)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}

      {/* Selected location display */}
      {(selectedRegion || selectedTown) && !isOpen ? (
        <div
          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center">
            <MapPin size={18} className="text-[rgb(41,121,255)] mr-2" />
            <div>
              {selectedTown && (
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedTown}</div>
              )}
              {selectedRegion && <div className="text-xs text-gray-500">{selectedRegion}</div>}
            </div>
          </div>
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      ) : (
        <div
          className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Search size={18} className="text-gray-400 mr-2" />
          <span className="text-gray-500">{placeholder}</span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[rgb(41,121,255)] text-sm"
                autoFocus
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {/* Regions */}
            {filteredRegions.length > 0 && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 px-2 py-1">Regions</div>
                {filteredRegions.map((region) => (
                  <div
                    key={region.name}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    onClick={() => handleRegionSelect(region.name)}
                  >
                    <MapPin size={16} className="text-[rgb(41,121,255)] mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{region.name}</div>
                      <div className="text-xs text-gray-500">Capital: {region.capital}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Towns */}
            {filteredTowns.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 px-2 py-1">Towns</div>
                {filteredTowns.map((town, index) => (
                  <div
                    key={`${town.name}-${index}`}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    onClick={() => handleTownSelect(town.name, town.region)}
                  >
                    <MapPin size={16} className="text-[rgb(41,121,255)] mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{town.name}</div>
                      <div className="text-xs text-gray-500">{town.region}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {filteredRegions.length === 0 && filteredTowns.length === 0 && searchTerm && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">No locations found for "{searchTerm}"</p>
                {selectedRegion ? (
                  <button
                    className="text-sm text-[rgb(41,121,255)] font-medium"
                    onClick={() => setShowCustomInput(true)}
                  >
                    Add as new location in {selectedRegion}
                  </button>
                ) : (
                  <p className="text-xs text-gray-500">Please select a region first to add a custom location</p>
                )}
              </div>
            )}

            {/* Custom location input */}
            {showCustomInput && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 mb-2">Add new location in {selectedRegion}</div>
                <div className="flex">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter location name"
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[rgb(41,121,255)] text-sm"
                    autoFocus
                  />
                  <button
                    className="px-3 py-2 bg-[rgb(41,121,255)] text-white rounded-r-lg text-sm font-medium disabled:opacity-50"
                    onClick={handleCustomLocationSubmit}
                    disabled={!customLocation.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
