import React, { type ReactElement } from "react";
import {
  Car,
  ShieldCheck,
  Clock3,
  Users,
  MapPin,
  CreditCard,
  CheckCircle2,
  Star,
  ArrowRight,
  Headphones,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

// =========================================================
// ABOUT PAGE
// =========================================================

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">
        {/* Background decoration */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

        <div className="absolute right-1/3 top-1/3 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Car className="h-4 w-4" />

              <span>About Our Vehicle Rental Platform</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Journey,
              <span className="block text-blue-100">Our Priority</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              We make vehicle rentals simple, reliable, affordable, and
              convenient. Find the right vehicle, book it easily, and enjoy your
              journey with confidence.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/vehicles"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Browse Vehicles
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Contact Us
                <Headphones className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Left */}

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              Who We Are
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Making Vehicle Rental
              <span className="text-blue-600"> Simple & Reliable</span>
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Our vehicle rental platform connects customers with vehicle owners
              through an easy-to-use online booking system. Whether you need a
              car for a short trip, a family vacation, a business journey, or
              everyday travel, we help you find a vehicle that fits your needs.
            </p>

            <p className="mt-4 leading-7 text-gray-600">
              Vehicle owners can list their vehicles, manage bookings, track
              earnings, and connect with customers. Customers can search
              vehicles, compare options, make bookings, and manage their rentals
              from one convenient platform.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-2xl font-bold text-blue-600">24/7</p>

                <p className="mt-1 text-sm text-gray-500">
                  Platform Availability
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-2xl font-bold text-blue-600">Easy</p>

                <p className="mt-1 text-sm text-gray-500">Online Booking</p>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-xl">
              <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  Drive With Confidence
                </h3>

                <p className="mt-4 leading-7 text-blue-100">
                  From browsing to booking, our goal is to provide a smooth
                  experience for every customer and vehicle owner.
                </p>

                <div className="mt-7 space-y-3">
                  <FeatureCheck text="Verified vehicle listings" />

                  <FeatureCheck text="Simple booking process" />

                  <FeatureCheck text="Transparent pricing" />

                  <FeatureCheck text="Reliable customer support" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR VALUES
      ====================================================== */}

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Our Values
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              What We Stand For
            </h2>

            <p className="mt-4 text-gray-600">
              Everything we build is focused on making vehicle rental better for
              customers and owners.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ValueCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Safety First"
              description="We focus on creating a trustworthy rental experience with reliable listings and secure booking processes."
            />

            <ValueCard
              icon={<Clock3 className="h-6 w-6" />}
              title="Convenience"
              description="Search, compare, book, and manage your rentals from one easy-to-use platform."
            />

            <ValueCard
              icon={<Users className="h-6 w-6" />}
              title="Community"
              description="We connect vehicle owners and renters to create a convenient rental marketplace."
            />

            <ValueCard
              icon={<CreditCard className="h-6 w-6" />}
              title="Transparent Pricing"
              description="We believe customers should clearly understand the cost of their vehicle rental before booking."
            />

            <ValueCard
              icon={<MapPin className="h-6 w-6" />}
              title="Flexible Travel"
              description="Choose vehicles based on your travel requirements, location, dates, and budget."
            />

            <ValueCard
              icon={<Headphones className="h-6 w-6" />}
              title="Customer Support"
              description="We aim to provide helpful support throughout the rental journey."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Simple Process
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <StepCard
              number="01"
              icon={<Car className="h-7 w-7" />}
              title="Find Your Vehicle"
              description="Browse available vehicles and use filters to find the perfect option for your trip."
            />

            <StepCard
              number="02"
              icon={<Calendar className="h-7 w-7" />}
              title="Choose Your Dates"
              description="Select your pickup and return dates and review the booking details."
            />

            <StepCard
              number="03"
              icon={<CheckCircle2 className="h-7 w-7" />}
              title="Book & Enjoy"
              description="Complete your booking and get ready to enjoy a comfortable journey."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FOR OWNERS
      ====================================================== */}

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                  <Users className="h-4 w-4" />
                  For Vehicle Owners
                </div>

                <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                  Turn Your Vehicle Into an Opportunity
                </h2>

                <p className="mt-5 leading-7 text-gray-300">
                  Vehicle owners can list their vehicles and reach customers
                  looking for reliable rental options. Manage your vehicles,
                  bookings, reviews, and earnings from one place.
                </p>

                <div className="mt-7 space-y-3">
                  <FeatureCheck text="Add and manage vehicles" dark />

                  <FeatureCheck text="Manage customer bookings" dark />

                  <FeatureCheck text="Track rental earnings" dark />

                  <FeatureCheck text="Receive customer reviews" dark />
                </div>

                <Link
                  to="/register"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Become an Owner
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative hidden min-h-[400px] overflow-hidden bg-blue-600 lg:block">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl">
                      <Car className="h-12 w-12 text-blue-600" />
                    </div>

                    <p className="mt-6 text-xl font-bold text-white">
                      List. Rent. Earn.
                    </p>

                    <p className="mt-2 text-blue-100">
                      Grow your rental business with us.
                    </p>
                  </div>
                </div>

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Why Choose Us
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                Everything You Need for a Better Rental Experience
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                We combine convenient technology with a customer-focused
                approach to make vehicle rentals easier for everyone.
              </p>

              <div className="mt-8 space-y-5">
                <WhyChooseItem
                  icon={<ShieldCheck />}
                  title="Reliable Platform"
                  description="A simple platform designed to make renting and managing vehicles easier."
                />

                <WhyChooseItem
                  icon={<Clock3 />}
                  title="Save Time"
                  description="Find vehicles and manage bookings without unnecessary steps."
                />

                <WhyChooseItem
                  icon={<Star />}
                  title="Customer Reviews"
                  description="Review and discover vehicles based on rental experiences."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoBox value="Easy" label="Vehicle Search" />

              <InfoBox value="Fast" label="Booking Process" />

              <InfoBox value="Secure" label="Rental Experience" />

              <InfoBox value="24/7" label="Platform Access" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Car className="h-7 w-7 text-white" />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Your Journey?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Explore available vehicles and find the right rental option for your
            next trip.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/vehicles"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Vehicles
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// =========================================================
// FEATURE CHECK
// =========================================================

interface FeatureCheckProps {
  text: string;
  dark?: boolean;
}

const FeatureCheck: React.FC<FeatureCheckProps> = ({ text, dark = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          dark ? "bg-white/10" : "bg-white/20"
        }`}
      >
        <CheckCircle2
          className={`h-3.5 w-3.5 ${dark ? "text-blue-400" : "text-white"}`}
        />
      </div>

      <span className={`text-sm ${dark ? "text-gray-300" : "text-blue-50"}`}>
        {text}
      </span>
    </div>
  );
};

// =========================================================
// VALUE CARD
// =========================================================

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
};

// =========================================================
// STEP CARD
// =========================================================

interface StepCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({
  number,
  icon,
  title,
  description,
}) => {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm">
      <div className="absolute right-5 top-5 text-4xl font-black text-gray-100">
        {number}
      </div>

      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-gray-900">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
};

// =========================================================
// WHY CHOOSE ITEM
// =========================================================

interface WhyChooseItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const WhyChooseItem: React.FC<WhyChooseItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {React.cloneElement(
          icon as ReactElement,
          {
            className: "h-5 w-5",
          } as { className?: string },
        )}
      </div>

      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// =========================================================
// INFO BOX
// =========================================================

interface InfoBoxProps {
  value: string;
  label: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ value, label }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
      <p className="text-2xl font-extrabold text-blue-600">{value}</p>

      <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};

export default About;
