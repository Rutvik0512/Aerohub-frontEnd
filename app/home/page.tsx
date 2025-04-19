"use client"
import {AirportDto} from "@/dtos/airportdto";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    ArrowUpDown,
    Check,
    Clock,
    Compass,
    Flag,
    Globe,
    Loader2,
    MapPin,
    Mountain,
    Plane,
    Plus,
    Snowflake
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {motion} from "framer-motion";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import {Searchandfilter} from "@/app/searchandfilter";

const getUrl = ({
                    pageSize = 10,
                    pageNumber = 0,
                    sortField,
                    sortDirection,
                    search,
                }: {
    pageSize?: number;
    pageNumber?: number;
    sortField?: string | null;
    sortDirection?: string | null;
    search?: string | null;
}) => {
    const baseUrl = "https://aero-hub.cfapps.us10-001.hana.ondemand.com/api/v1/airports";
    const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        pageNumber: pageNumber.toString(),
    });

    if (sortField) {
        params.append("sortField", sortField)
    }
    if (sortDirection) {
        params.append("sortDirection", sortDirection)
    }
    if (search && search.trim() !== "") {
        params.append("search", search.trim())
    }
    return `${baseUrl}?${params.toString()}`;
};

const parseAirport = (raw: AirportDto): AirportDto => {
    return new AirportDto({
        icao: raw.icao,
        iata: raw.iata ?? "",
        name: raw.name,
        city: raw.city ?? "",
        state: raw.state ?? "",
        country: raw.country,
        elevation: raw.elevation,
        lat: raw.lat,
        lon: raw.lon,
        timezone: raw.timezone,
    });
};

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
    const [airports, setAirports] = useState<AirportDto[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({key: null, direction: null})
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [formTab, setFormTab] = useState("basic")
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
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
        timezone: "America/New_York",
    })
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        const fetchAirports = async () => {
            setLoading(true);
            try {
                const url = getUrl({
                    pageSize: rowsPerPage,
                    pageNumber: currentPage - 1,
                    sortField: sortConfig.key,
                    sortDirection: sortConfig ? sortConfig.direction === "desc" ? "desc" : "asc" : null,
                    search: searchTerm.trim(),
                });
                const resp = await fetch(url);
                const json = await resp.json();
                const rawList: Airportdto[] = json.content || [];
                setAirports(rawList.map(parseAirport));
                setTotalPages(json.totalPages);
                setTotalElements(json.totalElements);
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAirports();
    }, [currentPage, rowsPerPage, sortConfig.key, sortConfig.direction, searchTerm]);

    // Update ICAO based on key
    useEffect(() => {
        if (newAirport.key) {
            setNewAirport((prev) => ({
                ...prev,
                icao: prev.key,
            }))
        }
    }, [newAirport.key])

    const requestSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({key, direction})
    }

    // Get sort direction indicator
    const getSortDirectionIndicator = (key) => {
        if (sortConfig.key !== key) return null
        return sortConfig.direction === "asc" ? " ↑" : " ↓"
    }

    // Animation variants for table rows
    const tableRowVariants = {
        hidden: {opacity: 0, y: 20},
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
            transition: {duration: 0.2},
        },
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const {name, value} = e.target
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
        if (!newAirport.timezone) errors.timezone = "Timezone is required"

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
                    timezone: "America/New_York",
                })
                setFormTab("basic")
            }, 1500)
        }, 2000)
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                    <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">
                        Airport Database Explorer
                    </h1>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
                        Browse and manage airport information from around the United States
                    </p>
                </motion.div>

                <Searchandfilter
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    onAddNew={() => setIsModalOpen(true)}
                />
                {loading ? (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="p-4">
                            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md mb-4 animate-pulse"></div>
                            {Array.from({length: 5}).map((_, index) => (
                                <div key={index} className="flex gap-3 mb-4">
                                    {Array.from({length: 11}).map((_, cellIndex) => (
                                        <div
                                            key={cellIndex}
                                            className="h-12 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse"
                                            style={{animationDelay: `${(index * 11 + cellIndex) * 0.05}s`}}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
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
                                                <Plane className="h-4 w-4 text-teal-500"/>
                                                <span>Key{getSortDirectionIndicator("key")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("icao")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-teal-500"/>
                                                <span>ICAO{getSortDirectionIndicator("icao")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("iata")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ArrowUpDown className="h-4 w-4 text-teal-500"/>
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
                                                <MapPin className="h-4 w-4 text-teal-500"/>
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
                                                <Flag className="h-4 w-4 text-teal-500" />
                                                <span>Country{getSortDirectionIndicator("country")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                                            onClick={() => requestSort("elevation")}
                                        >
                                            <div className="flex items-center gap-2 justify-end">
                                                <Mountain className="h-4 w-4 text-teal-500"/>
                                                <span>Elevation{getSortDirectionIndicator("elevation")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                                            onClick={() => requestSort("lat")}
                                        >
                                            <div className="flex items-center gap-2 justify-end">
                                                <Compass className="h-4 w-4 text-teal-500"/>
                                                <span>Lat{getSortDirectionIndicator("lat")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right"
                                            onClick={() => requestSort("lon")}
                                        >
                                            <div className="flex items-center gap-2 justify-end">
                                                <Compass className="h-4 w-4 text-teal-500"/>
                                                <span>Lon{getSortDirectionIndicator("lon")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => requestSort("timezone")}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-teal-500"/>
                                                <span>Timezone{getSortDirectionIndicator("timezone")}</span>
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => {}}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-teal-500"/>
                                                <span>Region</span>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {airports.length > 0 ? (
                                        airports.map((airport, index) => (
                                            <motion.tr
                                                key={airport.key}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                variants={tableRowVariants}
                                                whileHover={{
                                                    scale: 1.01,
                                                    y: -5,
                                                }}
                                                className={`group transition-all duration-200 cursor-pointer transform ${
                                                    airport.elevation > 8000
                                                        ? 'bg-blue-100 dark:bg-blue-900/30'
                                                        : 'hover:bg-teal-50 dark:hover:bg-teal-900/10'
                                                } hover:shadow-sm hover:scale-[1.01]`}
                                            >
                                                <TableCell className="relative font-medium pl-6">
                                                    {airport.elevation> 8000 && (
                                                        <Snowflake className="absolute top-1 left-1 h-4 w-4 text-blue-400" />
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="font-mono text-teal-600 dark:text-teal-400">{airport.key}</span>
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
                                                        {airport.timezone}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{airport.region}</TableCell>
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

                        <div
                            className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span
                                className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                                <span
                                    className="font-medium">{Math.min(currentPage * rowsPerPage, totalElements)}</span> of{" "}
                                <span className="font-medium">{totalElements}</span> airports
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
                                    {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
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
                                            <SelectValue placeholder="Rows"/>
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
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.8}}
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
                            <Plane className="mr-2 h-5 w-5 text-teal-500"/>
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
                                            {formErrors.city &&
                                                <p className="text-sm text-red-500">{formErrors.city}</p>}
                                        </div>

                                        {/*<div className="space-y-2">*/}
                                        {/*    <Label htmlFor="state">State</Label>*/}
                                        {/*    <Select value={newAirport.state} onValueChange={(value) => handleSelectChange("state", value)}>*/}
                                        {/*        <SelectTrigger id="state" className={formErrors.state ? "border-red-500" : ""}>*/}
                                        {/*            <SelectValue placeholder="Select state" />*/}
                                        {/*        </SelectTrigger>*/}
                                        {/*        <SelectContent>*/}
                                        {/*            {STATES.map((state) => (*/}
                                        {/*                <SelectItem key={state} value={state}>*/}
                                        {/*                    {state}*/}
                                        {/*                </SelectItem>*/}
                                        {/*            ))}*/}
                                        {/*        </SelectContent>*/}
                                        {/*    </Select>*/}
                                        {/*    {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={() => setFormTab("details")}
                                            className="bg-teal-500 hover:bg-teal-600">
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
                                            {formErrors.elevation &&
                                                <p className="text-sm text-red-500">{formErrors.elevation}</p>}
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
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Select value={newAirport.timezone}
                                                onValueChange={(value) => handleSelectChange("timezone", value)}>
                                            <SelectTrigger id="timezone"
                                                           className={formErrors.timezone ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select timezone"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIMEZONES.map((timezone) => (
                                                    <SelectItem key={timezone} value={timezone}>
                                                        {timezone}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {formErrors.timezone &&
                                            <p className="text-sm text-red-500">{formErrors.timezone}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setFormTab("basic")}>
                                        Back
                                    </Button>
                                    <Button onClick={handleSubmit} className="bg-teal-500 hover:bg-teal-600"
                                            disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Adding Airport...
                                            </>
                                        ) : showSuccess ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4"/>
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