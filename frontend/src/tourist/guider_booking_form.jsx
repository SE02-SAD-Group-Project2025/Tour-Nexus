import React from 'react';
import { 
    Calendar, MapPin, User, Phone, Star, Send
} from 'lucide-react';

export default function GuideBookingForm({ 
    guide = {},
    selectedDates = {},
    onSubmit,
    onCancel
}) {
    // Mock guide data if not provided
    const guideData = {
        guide_id: guide.guide_id || 'G001',
        email: guide.email || 'guide@example.com',
        full_name: guide.full_name || 'Saman Perera',
        age: guide.age || 35,
        years_of_experience: guide.years_of_experience || 8,
        contact_number: guide.contact_number || '+94712345678',
        bio: guide.bio || 'Experienced guide specializing in cultural and historical tours of Sri Lanka.',
        profile_image: guide.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        languages: guide.languages || ['English', 'Sinhala', 'Tamil'],
        specialities: guide.specialities || ['Cultural Tours', 'Historical Sites', 'Nature Walks'],
        area_cover: guide.area_cover || ['Colombo', 'Kandy', 'Galle'],
        daily_rate: guide.daily_rate || 75,
        hourly_rate: guide.hourly_rate || 12,
        rating: guide.rating || 4.8,
        total_reviews: guide.total_reviews || 127
    };

    const totalAmount = selectedDates.days_count ? parseInt(selectedDates.days_count) * guideData.daily_rate : 0;

    const handleSubmit = () => {
        const bookingData = {
            guide_booking_id: `GB${Date.now()}`,
            tourist_email: 'tourist@example.com',
            guide_email: guideData.email,
            start_date: selectedDates.start_date,
            end_date: selectedDates.end_date,
            days_count: selectedDates.days_count,
            total_amount: totalAmount.toString(),
            booking_status: 'requested'
        };

        console.log('Booking data:', bookingData);
        
        if (onSubmit) {
            onSubmit(bookingData);
        } else {
            alert('Booking request submitted successfully!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Guide</h1>
                    <p className="text-gray-600">Complete your booking with {guideData.full_name}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Guide Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-center mb-6">
                                <img
                                    src={guideData.profile_image}
                                    alt={guideData.full_name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h2 className="text-xl font-bold text-gray-900">{guideData.full_name}</h2>
                                <div className="flex items-center justify-center mt-2">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="ml-1 text-sm font-medium">{guideData.rating}</span>
                                    <span className="ml-1 text-sm text-gray-500">({guideData.total_reviews} reviews)</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center text-gray-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{guideData.years_of_experience} years experience</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{guideData.contact_number}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{guideData.languages.join(', ')}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{guideData.area_cover.join(', ')}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Daily Rate:</span>
                                    <span className="font-semibold">${guideData.daily_rate}</span>
                                </div>
                            </div>

                            {selectedDates.days_count && (
                                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                    <h3 className="font-semibold text-blue-900 mb-2">Booking Summary</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Days:</span>
                                            <span>{selectedDates.days_count}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-blue-900 border-t border-blue-200 pt-2">
                                            <span>Total:</span>
                                            <span>${totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="space-y-6">
                                {/* Selected Dates Display */}
                                {selectedDates.start_date && selectedDates.end_date && (
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-green-900 mb-2">Selected Dates</h3>
                                        <div className="flex items-center text-green-700">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{selectedDates.start_date} to {selectedDates.end_date}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Tour Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tour Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Guests
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                placeholder="Enter number of guests"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nationality
                                            </label>
                                            <select className="w-full p-3 border border-gray-300 rounded-lg">
                                                <option value="">Select Nationality</option>
                                                <option value="Afghan">Afghan</option>
                                                <option value="Albanian">Albanian</option>
                                                <option value="Algerian">Algerian</option>
                                                <option value="American">American</option>
                                                <option value="Andorran">Andorran</option>
                                                <option value="Angolan">Angolan</option>
                                                <option value="Argentine">Argentine</option>
                                                <option value="Armenian">Armenian</option>
                                                <option value="Australian">Australian</option>
                                                <option value="Austrian">Austrian</option>
                                                <option value="Azerbaijani">Azerbaijani</option>
                                                <option value="Bahamian">Bahamian</option>
                                                <option value="Bahraini">Bahraini</option>
                                                <option value="Bangladeshi">Bangladeshi</option>
                                                <option value="Barbadian">Barbadian</option>
                                                <option value="Belarusian">Belarusian</option>
                                                <option value="Belgian">Belgian</option>
                                                <option value="Belizean">Belizean</option>
                                                <option value="Beninese">Beninese</option>
                                                <option value="Bhutanese">Bhutanese</option>
                                                <option value="Bolivian">Bolivian</option>
                                                <option value="Bosnian">Bosnian</option>
                                                <option value="Brazilian">Brazilian</option>
                                                <option value="British">British</option>
                                                <option value="Bruneian">Bruneian</option>
                                                <option value="Bulgarian">Bulgarian</option>
                                                <option value="Burkinabe">Burkinabe</option>
                                                <option value="Burmese">Burmese</option>
                                                <option value="Burundian">Burundian</option>
                                                <option value="Cambodian">Cambodian</option>
                                                <option value="Cameroonian">Cameroonian</option>
                                                <option value="Canadian">Canadian</option>
                                                <option value="Cape Verdean">Cape Verdean</option>
                                                <option value="Central African">Central African</option>
                                                <option value="Chadian">Chadian</option>
                                                <option value="Chilean">Chilean</option>
                                                <option value="Chinese">Chinese</option>
                                                <option value="Colombian">Colombian</option>
                                                <option value="Comoran">Comoran</option>
                                                <option value="Congolese">Congolese</option>
                                                <option value="Costa Rican">Costa Rican</option>
                                                <option value="Croatian">Croatian</option>
                                                <option value="Cuban">Cuban</option>
                                                <option value="Cypriot">Cypriot</option>
                                                <option value="Czech">Czech</option>
                                                <option value="Danish">Danish</option>
                                                <option value="Djiboutian">Djiboutian</option>
                                                <option value="Dominican">Dominican</option>
                                                <option value="Dutch">Dutch</option>
                                                <option value="Ecuadorean">Ecuadorean</option>
                                                <option value="Egyptian">Egyptian</option>
                                                <option value="Emirian">Emirian</option>
                                                <option value="English">English</option>
                                                <option value="Equatorial Guinean">Equatorial Guinean</option>
                                                <option value="Eritrean">Eritrean</option>
                                                <option value="Estonian">Estonian</option>
                                                <option value="Ethiopian">Ethiopian</option>
                                                <option value="Fijian">Fijian</option>
                                                <option value="Filipino">Filipino</option>
                                                <option value="Finnish">Finnish</option>
                                                <option value="French">French</option>
                                                <option value="Gabonese">Gabonese</option>
                                                <option value="Gambian">Gambian</option>
                                                <option value="Georgian">Georgian</option>
                                                <option value="German">German</option>
                                                <option value="Ghanaian">Ghanaian</option>
                                                <option value="Greek">Greek</option>
                                                <option value="Grenadian">Grenadian</option>
                                                <option value="Guatemalan">Guatemalan</option>
                                                <option value="Guinea-Bissauan">Guinea-Bissauan</option>
                                                <option value="Guinean">Guinean</option>
                                                <option value="Guyanese">Guyanese</option>
                                                <option value="Haitian">Haitian</option>
                                                <option value="Herzegovinian">Herzegovinian</option>
                                                <option value="Honduran">Honduran</option>
                                                <option value="Hungarian">Hungarian</option>
                                                <option value="I-Kiribati">I-Kiribati</option>
                                                <option value="Icelander">Icelander</option>
                                                <option value="Indian">Indian</option>
                                                <option value="Indonesian">Indonesian</option>
                                                <option value="Iranian">Iranian</option>
                                                <option value="Iraqi">Iraqi</option>
                                                <option value="Irish">Irish</option>
                                                <option value="Israeli">Israeli</option>
                                                <option value="Italian">Italian</option>
                                                <option value="Ivorian">Ivorian</option>
                                                <option value="Jamaican">Jamaican</option>
                                                <option value="Japanese">Japanese</option>
                                                <option value="Jordanian">Jordanian</option>
                                                <option value="Kazakhstani">Kazakhstani</option>
                                                <option value="Kenyan">Kenyan</option>
                                                <option value="Kittian and Nevisian">Kittian and Nevisian</option>
                                                <option value="Kuwaiti">Kuwaiti</option>
                                                <option value="Kyrgyz">Kyrgyz</option>
                                                <option value="Laotian">Laotian</option>
                                                <option value="Latvian">Latvian</option>
                                                <option value="Lebanese">Lebanese</option>
                                                <option value="Liberian">Liberian</option>
                                                <option value="Libyan">Libyan</option>
                                                <option value="Liechtensteiner">Liechtensteiner</option>
                                                <option value="Lithuanian">Lithuanian</option>
                                                <option value="Luxembourgish">Luxembourgish</option>
                                                <option value="Macedonian">Macedonian</option>
                                                <option value="Malagasy">Malagasy</option>
                                                <option value="Malawian">Malawian</option>
                                                <option value="Malaysian">Malaysian</option>
                                                <option value="Maldivan">Maldivan</option>
                                                <option value="Malian">Malian</option>
                                                <option value="Maltese">Maltese</option>
                                                <option value="Marshallese">Marshallese</option>
                                                <option value="Mauritanian">Mauritanian</option>
                                                <option value="Mauritian">Mauritian</option>
                                                <option value="Mexican">Mexican</option>
                                                <option value="Micronesian">Micronesian</option>
                                                <option value="Moldovan">Moldovan</option>
                                                <option value="Monacan">Monacan</option>
                                                <option value="Mongolian">Mongolian</option>
                                                <option value="Moroccan">Moroccan</option>
                                                <option value="Mosotho">Mosotho</option>
                                                <option value="Motswana">Motswana</option>
                                                <option value="Mozambican">Mozambican</option>
                                                <option value="Namibian">Namibian</option>
                                                <option value="Nauruan">Nauruan</option>
                                                <option value="Nepalese">Nepalese</option>
                                                <option value="New Zealander">New Zealander</option>
                                                <option value="Ni-Vanuatu">Ni-Vanuatu</option>
                                                <option value="Nicaraguan">Nicaraguan</option>
                                                <option value="Nigerian">Nigerian</option>
                                                <option value="Nigerien">Nigerien</option>
                                                <option value="North Korean">North Korean</option>
                                                <option value="Northern Irish">Northern Irish</option>
                                                <option value="Norwegian">Norwegian</option>
                                                <option value="Omani">Omani</option>
                                                <option value="Pakistani">Pakistani</option>
                                                <option value="Palauan">Palauan</option>
                                                <option value="Panamanian">Panamanian</option>
                                                <option value="Papua New Guinean">Papua New Guinean</option>
                                                <option value="Paraguayan">Paraguayan</option>
                                                <option value="Peruvian">Peruvian</option>
                                                <option value="Polish">Polish</option>
                                                <option value="Portuguese">Portuguese</option>
                                                <option value="Qatari">Qatari</option>
                                                <option value="Romanian">Romanian</option>
                                                <option value="Russian">Russian</option>
                                                <option value="Rwandan">Rwandan</option>
                                                <option value="Saint Lucian">Saint Lucian</option>
                                                <option value="Salvadoran">Salvadoran</option>
                                                <option value="Samoan">Samoan</option>
                                                <option value="San Marinese">San Marinese</option>
                                                <option value="Sao Tomean">Sao Tomean</option>
                                                <option value="Saudi">Saudi</option>
                                                <option value="Scottish">Scottish</option>
                                                <option value="Senegalese">Senegalese</option>
                                                <option value="Serbian">Serbian</option>
                                                <option value="Seychellois">Seychellois</option>
                                                <option value="Sierra Leonean">Sierra Leonean</option>
                                                <option value="Singaporean">Singaporean</option>
                                                <option value="Slovakian">Slovakian</option>
                                                <option value="Slovenian">Slovenian</option>
                                                <option value="Solomon Islander">Solomon Islander</option>
                                                <option value="Somali">Somali</option>
                                                <option value="South African">South African</option>
                                                <option value="South Korean">South Korean</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="Sri Lankan">Sri Lankan</option>
                                                <option value="Sudanese">Sudanese</option>
                                                <option value="Surinamer">Surinamer</option>
                                                <option value="Swazi">Swazi</option>
                                                <option value="Swedish">Swedish</option>
                                                <option value="Swiss">Swiss</option>
                                                <option value="Syrian">Syrian</option>
                                                <option value="Taiwanese">Taiwanese</option>
                                                <option value="Tajik">Tajik</option>
                                                <option value="Tanzanian">Tanzanian</option>
                                                <option value="Thai">Thai</option>
                                                <option value="Togolese">Togolese</option>
                                                <option value="Tongan">Tongan</option>
                                                <option value="Trinidadian or Tobagonian">Trinidadian or Tobagonian</option>
                                                <option value="Tunisian">Tunisian</option>
                                                <option value="Turkish">Turkish</option>
                                                <option value="Tuvaluan">Tuvaluan</option>
                                                <option value="Ugandan">Ugandan</option>
                                                <option value="Ukrainian">Ukrainian</option>
                                                <option value="Uruguayan">Uruguayan</option>
                                                <option value="Uzbekistani">Uzbekistani</option>
                                                <option value="Venezuelan">Venezuelan</option>
                                                <option value="Vietnamese">Vietnamese</option>
                                                <option value="Welsh">Welsh</option>
                                                <option value="Yemenite">Yemenite</option>
                                                <option value="Zambian">Zambian</option>
                                                <option value="Zimbabwean">Zimbabwean</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Emergency Contact
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                placeholder="+94712345678"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Special Requests
                                            </label>
                                            <textarea
                                                rows={3}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                placeholder="Any specific requirements or preferences..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terms and Total */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-semibold">Total Amount:</span>
                                        <span className="text-2xl font-bold text-blue-600">${totalAmount}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        * Final amount may vary based on specific requirements and additional services.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Submit Booking Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}