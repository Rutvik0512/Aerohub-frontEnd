"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plane, MapPin, Globe, ArrowUpDown, Mountain, Compass, Clock, Plus, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample airport data based on the provided information
const sampleAirportData = [
  {
    id: 1,
    key: "00AK",
    icao: "00AK",
    iata: "",
    name: "Lowell Field",
    city: "Anchor Point",
    state: "Alaska",
    country: "US",
    elevation: 450,
    lat: 59.9492,
    lon: -151.696,
    tz: "America/Anchorage",
  },
  {
    id: 2,
    key: "00AL",
    icao: "00AL",
    iata: "",
    name: "Epps Airpark",
    city: "Harvest",
    state: "Alabama",
    country: "US",
    elevation: 820,
    lat: 34.8648,
    lon: -86.7703,
    tz: "America/Chicago",
  },
  {
    id: 3,
    key: "00AZ",
    icao: "00AZ",
    iata: "",
    name: "Cordes Airport",
    city: "Cordes",
    state: "Arizona",
    country: "US",
    elevation: 3810,
    lat: 34.3056,
    lon: -112.165,
    tz: "America/Phoenix",
  },
  {
    id: 4,
    key: "00SC",
    icao: "00SC",
    iata: "",
    name: "Flying O Airport",
    city: "Sumter",
    state: "South Carolina",
    country: "US",
    elevation: 150,
    lat: 34.0094,
    lon: -80.2672,
    tz: "America/New_York",
  },
  {
    id: 5,
    key: "00TN",
    icao: "00TN",
    iata: "",
    name: "Ragsdale Airfield",
    city: "Manchester",
    state: "Tennessee",
    country: "US",
    elevation: 1100,
    lat: 35.5159,
    lon: -85.9536,
    tz: "America/Chicago",
  },
  {
    id: 6,
    key: "00TS",
    icao: "00TS",
    iata: "",
    name: "Alpine Ranch Airport",
    city: "Everman",
    state: "Texas",
    country: "US",
    elevation: 670,
    lat: 32.6076,
    lon: -97.242,
    tz: "America/Chicago",
  },
  {
    id: 7,
    key: "00TX",
    icao: "00TX",
    iata: "",
    name: "Delva Field",
    city: "Van",
    state: "Texas",
    country: "US",
    elevation: 545,
    lat: 32.54445,
    lon: -95.6731,
    tz: "America/Chicago",
  },
  {
    id: 8,
    key: "00VA",
    icao: "00VA",
    iata: "",
    name: "Vaughan Airport",
    city: "Alton",
    state: "Virginia",
    country: "US",
    elevation: 551,
    lat: 36.576,
    lon: -78.9992,
    tz: "America/New_York",
  },
  {
    id: 9,
    key: "00VI",
    icao: "00VI",
    iata: "",
    name: "Groundhog Mountain Airport",
    city: "Hillsville",
    state: "Virginia",
    country: "US",
    elevation: 2680,
    lat: 36.6633,
    lon: -80.4995,
    tz: "America/New_York",
  },
  {
    id: 10,
    key: "00WA",
    icao: "00WA",
    iata: "",
    name: "Howell Airport",
    city: "Longbranch",
    state: "Washington",
    country: "US",
    elevation: 150,
    lat: 47.1784,
    lon: -122.772,
    tz: "America/Los_Angeles",
  },
  {
    id: 11,
    key: "00WI",
    icao: "00WI",
    iata: "",
    name: "Northern Lite Airport",
    city: "Waupaca",
    state: "Wisconsin",
    country: "US",
    elevation: 860,
    lat: 44.3043,
    lon: -89.0501,
    tz: "America/Chicago",
  },
  {
    id: 12,
    key: "00WN",
    icao: "00WN",
    iata: "",
    name: "Hawks Run Airport",
    city: "Asotín",
    state: "Washington",
    country: "US",
    elevation: 2900,
    lat: 46.25,
    lon: -117.249,
    tz: "America/Los_Angeles",
  },
  {
    id: 13,
    key: "00WV",
    icao: "00WV",
    iata: "",
    name: "Lazy J. Aerodrome",
    city: "Beverly",
    state: "West Virginia",
    country: "US",
    elevation: 2060,
    lat: 38.8289,
    lon: -79.8661,
    tz: "America/New_York",
  },
  {
    id: 14,
    key: "00XS",
    icao: "00XS",
    iata: "",
    name: "L P Askew Airport",
    city: "O'Donnell",
    state: "Texas",
    country: "US",
    elevation: 3110,
    lat: 33.0334,
    lon: -101.934,
    tz: "America/Chicago",
  },
  {
    id: 15,
    key: "01AL",
    icao: "01AL",
    iata: "",
    name: "Ware Island Airport",
    city: "Clanton",
    state: "Alabama",
    country: "US",
    elevation: 344,
    lat: 32.946,
    lon: -86.5139,
    tz: "America/Chicago",
  },
  {
    id: 16,
    key: "01CL",
    icao: "01CL",
    iata: "",
    name: "Swansboro Country Airport",
    city: "Placerville",
    state: "California",
    country: "US",
    elevation: 2594,
    lat: 38.7999,
    lon: -120.734,
    tz: "America/Los_Angeles",
  },
  {
    id: 17,
    key: "01FA",
    icao: "01FA",
    iata: "",
    name: "Rybolt Ranch Airport",
    city: "Orlando",
    state: "Florida",
    country: "US",
    elevation: 55,
    lat: 28.5894,
    lon: -81.1442,
    tz: "America/New_York",
  },
  {
    id: 18,
    key: "01FL",
    icao: "01FL",
    iata: "",
    name: "Cedar Knoll Flying Ranch",
    city: "Geneva",
    state: "Florida",
    country: "US",
    elevation: 19,
    lat: 28.7819,
    lon: -81.1592,
    tz: "America/New_York",
  },
  {
    id: 19,
    key: "01GE",
    icao: "01GE",
    iata: "",
    name: "The Farm Airport",
    city: "Wrightsville",
    state: "Georgia",
    country: "US",
    elevation: 375,
    lat: 32.6744,
    lon: -82.7711,
    tz: "America/New_York",
  },
  {
    id: 20,
    key: "01IA",
    icao: "01IA",
    iata: "",
    name: "Stender Airport",
    city: "Joiceville",
    state: "Iowa",
    country: "US",
    elevation: 725,
    lat: 41.6611,
    lon: -90.7413,
    tz: "America/Chicago",
  },
  {
    id: 21,
    key: "01ID",
    icao: "01ID",
    iata: "",
    name: "Lava Hot Springs Airport",
    city: "Lava Hot Springs",
    state: "Idaho",
    country: "US",
    elevation: 5268,
    lat: 42.6082,
    lon: -112.032,
    tz: "America/Boise",
  },
]

// Generate more airport data to have a larger dataset
const generateMoreAirportData = () => {
  const baseData = [...sampleAirportData]
  const states = [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Illinois",
    "Pennsylvania",
    "Ohio",
    "Georgia",
    "Michigan",
  ]
  const timezones = ["America/Los_Angeles", "America/Chicago", "America/New_York", "America/Denver", "America/Phoenix"]

  for (let i = 0; i < 280; i++) {
    const randomBase = baseData[Math.floor(Math.random() * baseData.length)]
    const randomState = states[Math.floor(Math.random() * states.length)]
    const randomTz = timezones[Math.floor(Math.random() * timezones.length)]

    // Generate a random airport code
    const code = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`

    baseData.push({
      id: baseData.length + 1,
      key: code,
      icao: code,
      iata: Math.random() > 0.7 ? code.substring(0, 3) : "",
      name: `${randomBase.name.split(" ")[0]} ${Math.random() > 0.5 ? "Regional" : "Municipal"} Airport`,
      city: randomBase.city,
      state: randomState,
      country: "US",
      elevation: Math.floor(Math.random() * 6000),
      lat: 30 + Math.random() * 20,
      lon: -120 + Math.random() * 40,
      tz: randomTz,
    })
  }

  return baseData
}

// Constants for form options
const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Boise",
]

export default function AirportDetailsPage() {
  const [airports, setAirports] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [stateFilter, setStateFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formTab, setFormTab] = useState("basic")

  // Form state
  const [newAirport, setNewAirport] = useState({
    key: "",
    icao: "",
    iata: "",
    name: "",
    city: "",
    state: "",
    country: "US",
    elevation: "",
    lat: "",
    lon: "",
    tz: "America/New_York",
  })

  // Form validation state
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    // Simulate loading time
    setLoading(true)
    setTimeout(() => {
      setAirports(generateMoreAirportData())
      setLoading(false)
    }, 1500)
  }, [])

  // Update ICAO based on key
  useEffect(() => {
    if (newAirport.key) {
      setNewAirport((prev) => ({
        ...prev,
        icao: prev.key,
      }))
    }
  }, [newAirport.key])

  // Filter airports based on search term and state
  const filteredAirports = airports.filter((airport) => {
    // Trim the search term and convert to lowercase
    const searchTermClean = searchTerm.trim().toLowerCase()

    // If search term is empty, only apply state filter
    if (!searchTermClean) {
      return stateFilter === "all" || airport.state === stateFilter
    }

    // Check all searchable fields with proper null checks
    const matchesSearch =
        (airport.key && airport.key.toLowerCase().includes(searchTermClean)) ||
        (airport.icao && airport.icao.toLowerCase().includes(searchTermClean)) ||
        (airport.iata && airport.iata.toLowerCase().includes(searchTermClean)) ||
        (airport.name && airport.name.toLowerCase().includes(searchTermClean)) ||
        (airport.city && airport.city.toLowerCase().includes(searchTermClean)) ||
        (airport.state && airport.state.toLowerCase().includes(searchTermClean)) ||
        (airport.tz && airport.tz.toLowerCase().includes(searchTermClean))

    const matchesState = stateFilter === "all" || airport.state === stateFilter

    return matchesSearch && matchesState
  })

  // Sort airports
  const sortedAirports = [...filteredAirports].sort((a, b) => {
    if (!sortConfig.key) return 0

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedAirports.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedAirports = sortedAirports.slice(startIndex, startIndex + rowsPerPage)

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }

  // Animation variants for table rows
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.01,
      transition: { duration: 0.2 },
    },
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAirport((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setNewAirport((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    // Required fields
    if (!newAirport.key) errors.key = "Airport code is required"
    if (!newAirport.name) errors.name = "Airport name is required"
    if (!newAirport.city) errors.city = "City is required"
    if (!newAirport.state) errors.state = "State is required"
    if (!newAirport.country) errors.country = "Country is required"
    if (!newAirport.tz) errors.tz = "Timezone is required"

    // Numeric validation
    if (!newAirport.elevation) {
      errors.elevation = "Elevation is required"
    } else if (isNaN(Number(newAirport.elevation))) {
      errors.elevation = "Elevation must be a number"
    }

    if (!newAirport.lat) {
      errors.lat = "Latitude is required"
    } else if (isNaN(Number(newAirport.lat)) || Number(newAirport.lat) < -90 || Number(newAirport.lat) > 90) {
      errors.lat = "Latitude must be a number between -90 and 90"
    }

    if (!newAirport.lon) {
      errors.lon = "Longitude is required"
    } else if (isNaN(Number(newAirport.lon)) || Number(newAirport.lon) < -180 || Number(newAirport.lon) > 180) {
      errors.lon = "Longitude must be a number between -180 and 180"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      // If there are validation errors, show the tab with errors
      if (
          Object.keys(formErrors).some((key) => ["key", "icao", "iata", "name", "city", "state", "country"].includes(key))
      ) {
        setFormTab("basic")
      } else {
        setFormTab("details")
      }
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Add new airport to the list
      const newId = Math.max(...airports.map((a) => a.id)) + 1

      const airportToAdd = {
        ...newAirport,
        id: newId,
        elevation: Number(newAirport.elevation),
        lat: Number(newAirport.lat),
        lon: Number(newAirport.lon),
      }

      setAirports((prev) => [airportToAdd, ...prev])
      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        setIsModalOpen(false)
        setNewAirport({
          key: "",
          icao: "",
          iata: "",
          name: "",
          city: "",
          state: "",
          country: "US",
          elevation: "",
          lat: "",
          lon: "",
          tz: "America/New_York",
        })
        setFormTab("basic")
      }, 1500)
    }, 2000)
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Airport Database Explorer
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
              Browse and manage airport information from around the United States
            </p>
          </motion.div>

          <Card className="mb-8 border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">Airport Search & Filters</CardTitle>
                <Button onClick={() => setIsModalOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add New Airport
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                        placeholder="Search by code, name, city, state or timezone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-300 dark:border-slate-700"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <div className="p-4">
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md mb-4 animate-pulse"></div>
                  {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex gap-3 mb-4">
                        {Array.from({ length: 11 }).map((_, cellIndex) => (
                            <div
                                key={cellIndex}
                                className="h-12 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse"
                                style={{ animationDelay: `${(index * 11 + cellIndex) * 0.05}s` }}
                            ></div>
                        ))}
                      </div>
                  ))}
                </div>
              </motion.div>
          ) : (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                      <TableRow>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("key")}
                        >
                          <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4 text-teal-500" />
                            <span>Key{getSortDirectionIndicator("key")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("icao")}
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-teal-500" />
                            <span>ICAO{getSortDirectionIndicator("icao")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("iata")}
                        >
                          <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-teal-500" />
                            <span>IATA{getSortDirectionIndicator("iata")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            <span>Name{getSortDirectionIndicator("name")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("city")}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-teal-500" />
                            <span>City{getSortDirectionIndicator("city")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("state")}
                        >
                          <div className="flex items-center gap-2">
                            <span>State{getSortDirectionIndicator("state")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("country")}
                        >
                          <div className="flex items-center gap-2">
                            <span>Country{getSortDirectionIndicator("country")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                            onClick={() => requestSort("elevation")}
                        >
                          <div className="flex items-center gap-2 justify-end">
                            <Mountain className="h-4 w-4 text-teal-500" />
                            <span>Elevation{getSortDirectionIndicator("elevation")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                            onClick={() => requestSort("lat")}
                        >
                          <div className="flex items-center gap-2 justify-end">
                            <Compass className="h-4 w-4 text-teal-500" />
                            <span>Lat{getSortDirectionIndicator("lat")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                            onClick={() => requestSort("lon")}
                        >
                          <div className="flex items-center gap-2 justify-end">
                            <Compass className="h-4 w-4 text-teal-500" />
                            <span>Lon{getSortDirectionIndicator("lon")}</span>
                          </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => requestSort("tz")}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-teal-500" />
                            <span>Timezone{getSortDirectionIndicator("tz")}</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAirports.length > 0 ? (
                          paginatedAirports.map((airport, index) => (
                              <motion.tr
                                  key={airport.id}
                                  custom={index}
                                  initial="hidden"
                                  animate="visible"
                                  variants={tableRowVariants}
                                  className="group hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all duration-200 hover:shadow-sm cursor-pointer transform hover:scale-[1.01]"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-teal-600 dark:text-teal-400">{airport.key}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono">{airport.icao}</TableCell>
                                <TableCell className="font-mono">{airport.iata || "-"}</TableCell>
                                <TableCell>{airport.name}</TableCell>
                                <TableCell>{airport.city}</TableCell>
                                <TableCell>{airport.state}</TableCell>
                                <TableCell>{airport.country}</TableCell>
                                <TableCell className="text-right">{airport.elevation} ft</TableCell>
                                <TableCell className="text-right">{airport.lat.toFixed(4)}</TableCell>
                                <TableCell className="text-right">{airport.lon.toFixed(4)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {airport.tz}
                                  </Badge>
                                </TableCell>
                              </motion.tr>
                          ))
                      ) : (
                          <TableRow>
                            <TableCell colSpan={11} className="h-24 text-center">
                              No airports found matching your criteria.
                            </TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Showing <span className="font-medium">{Math.min(startIndex + 1, filteredAirports.length)}</span> to{" "}
                    <span className="font-medium">{Math.min(startIndex + rowsPerPage, filteredAirports.length)}</span> of{" "}
                    <span className="font-medium">{filteredAirports.length}</span> airports
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 flex items-center justify-center"
                    >
                      <span className="sr-only">Previous Page</span>
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </Button>

                    <div className="flex items-center">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageToShow
                        if (totalPages <= 5) {
                          pageToShow = i + 1
                        } else {
                          const middlePoint = Math.min(Math.max(currentPage, 3), totalPages - 2)
                          pageToShow = middlePoint - 2 + i
                        }

                        return (
                            <Button
                                key={pageToShow}
                                variant={currentPage === pageToShow ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageToShow)}
                                className={`h-8 w-8 p-0 ${currentPage === pageToShow ? "bg-teal-500 hover:bg-teal-600" : ""}`}
                            >
                              {pageToShow}
                            </Button>
                        )
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="mx-1">...</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(totalPages)}
                                className="h-8 w-8 p-0"
                            >
                              {totalPages}
                            </Button>
                          </>
                      )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 flex items-center justify-center"
                    >
                      <span className="sr-only">Next Page</span>
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Button>

                    <div className="ml-4 w-32">
                      <Select
                          value={rowsPerPage.toString()}
                          onValueChange={(value) => {
                            setRowsPerPage(Number(value))
                            setCurrentPage(1)
                          }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 rows</SelectItem>
                          <SelectItem value="20">20 rows</SelectItem>
                          <SelectItem value="50">50 rows</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
          )}

          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            <p>Airport data is refreshed daily. Last updated: {new Date().toLocaleTimeString()}</p>
          </motion.div>
        </div>

        {/* Add New Airport Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] p-0">
            <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
              <DialogTitle className="text-xl font-semibold flex items-center">
                <Plane className="mr-2 h-5 w-5 text-teal-500" />
                Add New Airport
              </DialogTitle>
            </DialogHeader>

            <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
              <div className="px-6 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Location Details</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 pt-4 max-h-[70vh] overflow-y-auto">
                <TabsContent value="basic" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="key">Airport Code (Key)</Label>
                        <Input
                            id="key"
                            name="key"
                            value={newAirport.key}
                            onChange={handleInputChange}
                            placeholder="e.g., 00AK"
                            className={formErrors.key ? "border-red-500" : ""}
                            maxLength={4}
                        />
                        {formErrors.key && <p className="text-sm text-red-500">{formErrors.key}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="icao">ICAO Code</Label>
                        <Input
                            id="icao"
                            name="icao"
                            value={newAirport.icao}
                            onChange={handleInputChange}
                            placeholder="e.g., 00AK"
                            className="bg-slate-50"
                            disabled
                        />
                        <p className="text-xs text-slate-500">Auto-filled from Airport Code</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="iata">IATA Code (Optional)</Label>
                        <Input
                            id="iata"
                            name="iata"
                            value={newAirport.iata}
                            onChange={handleInputChange}
                            placeholder="e.g., LAX"
                            maxLength={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Airport Name</Label>
                      <Input
                          id="name"
                          name="name"
                          value={newAirport.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Lowell Field"
                          className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            value={newAirport.city}
                            onChange={handleInputChange}
                            placeholder="e.g., Anchor Point"
                            className={formErrors.city ? "border-red-500" : ""}
                        />
                        {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select value={newAirport.state} onValueChange={(value) => handleSelectChange("state", value)}>
                          <SelectTrigger id="state" className={formErrors.state ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setFormTab("details")} className="bg-teal-500 hover:bg-teal-600">
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="elevation">Elevation (ft)</Label>
                        <Input
                            id="elevation"
                            name="elevation"
                            type="number"
                            value={newAirport.elevation}
                            onChange={handleInputChange}
                            placeholder="e.g., 450"
                            className={formErrors.elevation ? "border-red-500" : ""}
                        />
                        {formErrors.elevation && <p className="text-sm text-red-500">{formErrors.elevation}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lat">Latitude</Label>
                        <Input
                            id="lat"
                            name="lat"
                            type="number"
                            step="0.0001"
                            value={newAirport.lat}
                            onChange={handleInputChange}
                            placeholder="e.g., 59.9492"
                            className={formErrors.lat ? "border-red-500" : ""}
                        />
                        {formErrors.lat && <p className="text-sm text-red-500">{formErrors.lat}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lon">Longitude</Label>
                        <Input
                            id="lon"
                            name="lon"
                            type="number"
                            step="0.0001"
                            value={newAirport.lon}
                            onChange={handleInputChange}
                            placeholder="e.g., -151.696"
                            className={formErrors.lon ? "border-red-500" : ""}
                        />
                        {formErrors.lon && <p className="text-sm text-red-500">{formErrors.lon}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tz">Timezone</Label>
                      <Select value={newAirport.tz} onValueChange={(value) => handleSelectChange("tz", value)}>
                        <SelectTrigger id="tz" className={formErrors.tz ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((timezone) => (
                              <SelectItem key={timezone} value={timezone}>
                                {timezone}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.tz && <p className="text-sm text-red-500">{formErrors.tz}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setFormTab("basic")}>
                      Back
                    </Button>
                    <Button onClick={handleSubmit} className="bg-teal-500 hover:bg-teal-600" disabled={isSubmitting}>
                      {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Airport...
                          </>
                      ) : showSuccess ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Airport Added!
                          </>
                      ) : (
                          "Add Airport"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
  )
}
