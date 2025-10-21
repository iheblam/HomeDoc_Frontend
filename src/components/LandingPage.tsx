import { useState } from 'react';

import { Heart, MessageSquare, Brain, CheckCircle, Shield, Clock, Users, AlertTriangle, FileText, Thermometer, Droplet, ArrowRight, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png'; // Adjust path as needed
import landimg from '../assets/landing.jpg';
interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src={logo}
                                alt="Medical HomeDoc Logo"
                                className="w-20 h-20 object-contain"  // Adjust size as needed
                            />
                            <div>
                                <div className="text-sm font-semibold text-[#81171b] -mt-1">HOMEDOC</div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <a href="#how-it-works" className="text-[#03071e] hover:text-[#03071e] font-medium transition-colors">How It Works</a>
                            <a href="#mission" className="text-[#03071e] hover:text-[#03071e] font-medium transition-colors">Our Mission</a>
                            <a href="#testimonials" className="text-[#03071e] hover:text-[#03071e] font-medium transition-colors">Testimonials</a>
                            <button
                                onClick={onGetStarted}
                                className="bg-[#81171b] text-white px-6 py-2 rounded-full hover:bg-[#81171b]/90 transition-all shadow-md hover:shadow-lg font-medium"
                            >
                                Sign In
                            </button>
                        </div>

                        <button
                            className="md:hidden text-[#03071e]"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-blue-100">
                        <div className="px-4 py-4 space-y-3">
                            <a href="#how-it-works" className="block text-[#03071e] hover:text-[#03071e] font-medium">How It Works</a>
                            <a href="#mission" className="block text-[#03071e] hover:text-[#03071e] font-medium">Our Mission</a>
                            <a href="#testimonials" className="block text-[#03071e] hover:text-[#03071e] font-medium">Testimonials</a>
                            <button
                                onClick={onGetStarted}
                                className="w-full bg-[#81171b] text-white px-6 py-2 rounded-full hover:bg-[#81171b]/90 transition-all font-medium"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-[#03071e] mb-6 leading-tight">
                            Your 24/7 Health Companion.
                            <span className="block text-[#81171b] mt-2">Clarity in Minutes, Not Days.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Get instant, free guidance for your health concerns. Our advanced AI helps you understand your symptoms
                            and advises on the best next step—whether it's self-care or seeing a doctor.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="bg-[#81171b] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#81171b]/90 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all inline-flex items-center space-x-3"
                        >
                            <span>Start Free Consultation</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="mt-4 text-sm text-gray-500">✓ No signup required  ✓ 100% Free  ✓ Private & Secure</p>
                    </div>

                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-50 to-neutral-100 rounded-3xl p-8 shadow-xl">
                            <img
                                src={landimg}
                                alt="Diverse group using health app"
                                className="rounded-2xl shadow-md w-full"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-md border border-blue-100">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                    <div>
                                        <div className="font-bold text-[#03071e]">50,000+</div>
                                        <div className="text-sm text-gray-500">Consultations</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem We Solve */}
            <section className="bg-gradient-to-r from-[#03071e]/5 to-[#81171b]/5 text-gray-900 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Healthcare Should Be Accessible, Not Anxiety-Inducing.
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
                            <div className="text-5xl mb-4">🤔</div>
                            <p className="text-lg italic">"Is this headache serious, or just stress?"</p>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
                            <div className="text-5xl mb-4">😰</div>
                            <p className="text-lg italic">"It's 2 AM, and your child has a fever. Do you go to the ER?"</p>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-sm">
                            <div className="text-5xl mb-4">💸</div>
                            <p className="text-lg italic">"Scheduling a doctor's appointment for a minor issue can be costly and time-consuming."</p>
                        </div>
                    </div>

                    <div className="text-center max-w-3xl mx-auto">
                        <p className="text-xl leading-relaxed">
                            You deserve immediate, preliminary guidance to help you make that call with confidence.
                            No more sleepless nights wondering if you should seek care.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-[#81171b] text-center mb-4">
                    Get Peace of Mind in Three Simple Steps
                </h2>
                <p className="text-gray-500 text-center mb-16 text-lg max-w-2xl mx-auto">
                    Our intelligent system guides you through a simple process to provide actionable health insights
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    <div
                        onMouseEnter={() => setHoveredStep(1)}
                        onMouseLeave={() => setHoveredStep(null)}
                        className={`bg-white rounded-3xl p-8 shadow-md border-2 transition-all ${hoveredStep === 1 ? 'border-[#81171b] shadow-xl transform -translate-y-2' : 'border-blue-50'
                            }`}
                    >
                        <div className="bg-gradient-to-br from-[#81171b] to-[#81171b]/90 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                            1
                        </div>
                        <div className="mb-4">
                            <MessageSquare className="w-10 h-10 text-[#81171b]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#03071e] mb-4">Describe Your Symptoms</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Tell our AI about your symptoms, just like you would a doctor. Be as detailed as you like.
                            For example: "I have a persistent dry cough for 3 days with mild fever."
                        </p>
                    </div>

                    <div
                        onMouseEnter={() => setHoveredStep(2)}
                        onMouseLeave={() => setHoveredStep(null)}
                        className={`bg-white rounded-3xl p-8 shadow-md border-2 transition-all ${hoveredStep === 2 ? 'border-[#81171b] shadow-xl transform -translate-y-2' : 'border-blue-50'
                            }`}
                    >
                        <div className="bg-gradient-to-br from-[#81171b] to-[#81171b]/90 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                            2
                        </div>
                        <div className="mb-4">
                            <Brain className="w-10 h-10 text-[#81171b]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#03071e] mb-4">Our AI Analyzes Your Situation</h3>
                        <p className="text-gray-500 leading-relaxed">
                            HealthGuard AI cross-references your information with a vast medical database to assess your
                            condition's potential severity and provides evidence-based insights.
                        </p>
                    </div>

                    <div
                        onMouseEnter={() => setHoveredStep(3)}
                        onMouseLeave={() => setHoveredStep(null)}
                        className={`bg-white rounded-3xl p-8 shadow-md border-2 transition-all ${hoveredStep === 3 ? 'border-[#81171b] shadow-xl transform -translate-y-2' : 'border-blue-50'
                            }`}
                    >
                        <div className="bg-gradient-to-br from-[#81171b] to-[#81171b]/90 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                            3
                        </div>
                        <div className="mb-4">
                            <CheckCircle className="w-10 h-10 text-[#81171b]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#03071e] mb-4">Get Clear Recommendations</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Receive straightforward guidance: 'Monitor at Home,' 'Schedule a Doctor's Visit,' or
                            'Seek Immediate Care,' with clear reasoning for each recommendation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="bg-gradient-to-br from-blue-50 to-red-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border-2 border-blue-50">
                        <div className="text-center mb-8">
                            <Heart className="w-16 h-16 text-[#81171b] mx-auto mb-4 fill-[#81171b]" />
                            <h2 className="text-3xl md:text-4xl font-bold text-[#03071e] mb-4">
                                Healthcare Guidance, Freely Given.
                            </h2>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-4xl mx-auto">
                            We believe that basic health consultation should be a <strong>right, not a privilege</strong>.
                            Unlike a paid telemedicine service, our platform is a charitable initiative. There are no fees,
                            no subscriptions, and no barriers.
                        </p>

                        <p className="text-lg text-gray-500 leading-relaxed max-w-4xl mx-auto">
                            Our goal is to reduce unnecessary healthcare costs and strain on clinics by empowering you with knowledge,
                            ensuring doctors' time is reserved for those who need it most. Every consultation you complete helps
                            us understand health patterns and improve our AI to serve communities better.
                        </p>

                        <div className="grid md:grid-cols-4 gap-6 mt-12">
                            <div className="text-center">
                                <div className="bg-[#81171b]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-8 h-8 text-[#81171b]" />
                                </div>
                                <div className="font-bold text-2xl text-[#03071e]">100%</div>
                                <div className="text-gray-500">Free Access</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-[#81171b]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Clock className="w-8 h-8 text-[#81171b]" />
                                </div>
                                <div className="font-bold text-2xl text-[#03071e]">24/7</div>
                                <div className="text-gray-500">Available</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-[#81171b]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Shield className="w-8 h-8 text-[#81171b]" />
                                </div>
                                <div className="font-bold text-2xl text-[#03071e]">Private</div>
                                <div className="text-gray-500">& Secure</div>
                            </div>
                            <div className="text-center">
                                <div className="bg-[#81171b]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Brain className="w-8 h-8 text-[#81171b]" />
                                </div>
                                <div className="font-bold text-2xl text-[#03071e]">AI-Powered</div>
                                <div className="text-gray-500">Intelligence</div>
                            </div>
                        </div>
                    </div>
                    </div>
            </section>

            {/* What We Cover */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-[#03071e] text-center mb-4">
                    Understanding Our Role in Your Health
                </h2>
                <p className="text-xl text-gray-500 text-center mb-12">
                    We are a supplement to professional medical care, not a replacement.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* What We Can Help With */}
                    <div className="bg-green-50 rounded-3xl p-8 border-2 border-green-100 shadow-sm">
                        <div className="flex items-center space-x-3 mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <h3 className="text-2xl font-bold text-green-900">What We Can Help With</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Thermometer className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-green-900">Common Colds, Flu & Seasonal Allergies</div>
                                    <div className="text-sm text-green-700">Sneezing, runny nose, mild fever, congestion</div>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Heart className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-green-900">Minor Cuts, Burns & Sprains</div>
                                    <div className="text-sm text-green-700">First aid guidance and wound care advice</div>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Brain className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-green-900">Headaches & Migraines</div>
                                    <div className="text-sm text-green-700">Tension headaches, mild to moderate pain</div>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Droplet className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-green-900">Digestive Issues</div>
                                    <div className="text-sm text-green-700">Indigestion, mild stomach discomfort, nausea</div>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Heart className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold text-green-900">General Wellness Questions</div>
                                    <div className="text-sm text-green-700">Prevention tips, healthy habits, nutrition basics</div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Critical Disclaimer */}
                    <div className="bg-[#81171b]/10 rounded-3xl p-8 border-2 border-[#81171b]/20 shadow-sm">
                        <div className="flex items-center space-x-3 mb-6">
                            <AlertTriangle className="w-8 h-8 text-[#81171b]" />
                            <h3 className="text-2xl font-bold text-[#81171b]">What We Cannot Do</h3>
                        </div>
                        <div className="bg-[#81171b]/20 border-l-4 border-[#81171b] p-4 mb-6 rounded">
                            <p className="font-bold text-[#81171b] mb-2 flex items-center">
                                <span className="text-2xl mr-2">🚨</span>
                                We Are Not an Emergency Service
                            </p>
                            <p className="text-[#81171b]">
                                If you are experiencing chest pain, difficulty breathing, severe bleeding, loss of consciousness,
                                or any other life-threatening condition, <strong>call emergency services immediately</strong> (911 in the US).
                            </p>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <X className="w-5 h-5 text-[#81171b] mt-1 flex-shrink-0" />
                                <div className="text-[#81171b]">
                                    <strong>No Formal Diagnosis:</strong> We provide information and guidance, not medical diagnoses.
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <X className="w-5 h-5 text-[#81171b] mt-1 flex-shrink-0" />
                                <div className="text-[#81171b]">
                                    <strong>No Prescriptions:</strong> We cannot prescribe medication or treatments.
                                </div>
                            </li>
                            <li className="flex items-start space-x-3">
                                <X className="w-5 h-5 text-[#81171b] mt-1 flex-shrink-0" />
                                <div className="text-[#81171b]">
                                    <strong>No Substitute for Doctors:</strong> Always consult a qualified healthcare provider for definitive care.
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="bg-gradient-to-br from-blue-50 to-red-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#03071e] text-center mb-4">
                        Trusted by Thousands
                    </h2>
                    <p className="text-gray-500 text-center mb-12 text-lg">
                        Real stories from people who found clarity and confidence
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl p-8 shadow-md border border-blue-50">
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">
                                "I was worried about a persistent rash on my arm. The AI calmly walked me through questions
                                and suggested it was likely a minor allergic reaction. It saved me a $100 copay for peace of mind!
                                I used the recommended over-the-counter cream and it cleared up in days."
                            </p>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-[#81171b]/10 rounded-full flex items-center justify-center">
                                    <span className="text-[#81171b] font-bold text-lg">SL</span>
                                </div>
                                <div>
                                    <div className="font-bold text-[#03071e]">Sarah L.</div>
                                    <div className="text-sm text-gray-500">Teacher, Mother of Two</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-blue-50">
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">
                                "When my toddler had a high fever at night, HealthGuard AI's recommendation to go to an urgent
                                care clinic was clear and decisive. It helped us avoid a panicked ER trip while still getting
                                the care she needed. The doctor confirmed it was strep throat - exactly what we needed to address."
                            </p>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-[#81171b]/10 rounded-full flex items-center justify-center">
                                    <span className="text-[#81171b] font-bold text-lg">MF</span>
                                </div>
                                <div>
                                    <div className="font-bold text-[#03071e]">The Miller Family</div>
                                    <div className="text-sm text-gray-500">Parents, New York</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-blue-50">
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">
                                "As someone without health insurance, this service is a lifesaver. I can get reliable guidance
                                without the stress of medical bills. When I had persistent back pain, it helped me understand
                                stretches and remedies, and when to finally see a specialist."
                            </p>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-[#81171b]/10 rounded-full flex items-center justify-center">
                                    <span className="text-[#81171b] font-bold text-lg">JR</span>
                                </div>
                                <div>
                                    <div className="font-bold text-[#03071e]">James R.</div>
                                    <div className="text-sm text-gray-500">Freelance Designer</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-md border border-blue-50">
                            <div className="flex items-center space-x-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">
                                "I travel a lot for work and got food poisoning abroad. At 3 AM, this AI helped me understand
                                what was normal and what required urgent care. The reassurance alone helped me manage the situation
                                calmly until I could reach a local clinic in the morning."
                            </p>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-[#81171b]/10 rounded-full flex items-center justify-center">
                                    <span className="text-[#81171b] font-bold text-lg">MP</span>
                                </div>
                                <div>
                                    <div className="font-bold text-[#03071e]">Maria P.</div>
                                    <div className="text-sm text-gray-500">Sales Executive</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-[#03071e]/10 to-[#81171b]/10 py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#03071e] mb-6">
                        Take Control of Your Health Journey Today
                    </h2>
                    <p className="text-xl text-[#81171b] mb-8">
                        It's free, private, and takes less than 5 minutes.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="bg-white text-[#03071e] px-10 py-5 rounded-full text-xl font-bold hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all inline-flex items-center space-x-3"
                    >
                        <span>Start Your Free Consultation Now</span>
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <p className="mt-6 text-[#81171b]">
                        Join over 50,000 people who've found health clarity with Medical HomeDoc
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#81171b]/10 text-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <img
                                src={logo}
                                alt="Medical HomeDoc Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div>
                                <div className="font-bold text-[#81171b]">MEDICAL HOMEDOC</div>
                                <div className="text-sm text-gray-600">Accessible Healthcare for All</div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-sm">
                            <div>
                                <h4 className="font-semibold text-[#81171b] mb-2">About</h4>
                                <ul className="space-y-1">
                                    <li><a href="#mission" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Our Mission</a></li>
                                    <li><a href="#how-it-works" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">How It Works</a></li>
                                    <li><a href="#testimonials" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Testimonials</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#81171b] mb-2">Legal</h4>
                                <ul className="space-y-1">
                                    <li><a href="#" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Privacy Policy</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Terms of Service</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Medical Disclaimer</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#81171b] mb-2">Contact</h4>
                                <ul className="space-y-1">
                                    <li><a href="#" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Contact Us</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Support</a></li>
                                    <li><a href="#" className="text-gray-600 hover:text-[#81171b] transition-colors duration-300">Feedback</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#81171b]/20 pt-6">
                        <div className="text-center text-sm text-gray-600 mb-4">
                            <p><strong>Medical Disclaimer:</strong> HealthGuard AI provides health information for educational purposes only. This service does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical advice, diagnosis, and treatment. Never disregard professional medical advice or delay seeking it because of information provided by this service.</p>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            <p>© 2025 Medical HomeDoc. A charitable health initiative.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}