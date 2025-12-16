import React from 'react'

function InterectiveRevel() {
    return (
        <>
            <div className="bg-neutral-100 overflow-hidden">

                {/* TEXT SECTION */}
                <div
                    className="
            grid grid-cols-12
            px-6 sm:px-10 lg:px-20
            pb-6 sm:pb-8
            translate-y-16 sm:translate-y-24 lg:translate-y-32
          "
                >
                    <div className="hidden md:block md:col-span-4" />

                    <div className="col-span-12 md:col-span-8 md:col-start-5">
                        <h1 className="font-bold text-4xl sm:text-5xl lg:text-7xl tracking-tighter leading-tight">
                            Work together.
                            <br />
                            Like in the office.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-600">
                            Create customized virtual office spaces for any department or event
                            with high quality audio and video conferencing.
                        </p>
                    </div>
                </div>

                {/* VIDEO SECTION */}
                <video
                    src="/waves.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="
            w-full object-cover
            h-[70vh] sm:h-[85vh] lg:h-[100vh]
            -mt-8 sm:-mt-12 lg:-mt-16
          "
                />

                {/* INFO + ICONS SECTION */}
                <div
                    className="
            grid grid-cols-12
            px-6 sm:px-10 lg:px-20
            -translate-y-30
          "
                >
                    <div className="hidden md:block md:col-span-4" />

                    <div className="col-span-12 md:col-span-8 md:col-start-5">
                        {/* Description text */}
                        <p className="text-xl sm:text-2xl max-w-2xl tracking-tight leading-snug text-gray-900">
                            Collaborating with remote teams is easy in your virtual office
                            environment. Enjoy real-time communication within your workspace
                            without additional software hassle.
                        </p>

                        {/* ICON GRID */}
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 ">

                            {/* Item 1 */}
                            <div className="flex flex-col items-start">
                                <img src="/icon1.png" alt="" className="h-10 w-10" />
                                <h3 className="mt-4 font-semibold text-lg">
                                    Customize workspace
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    Create your own offices and</p>
                                <p className=' text-sm text-gray-600 leading-relaxed'>meeting rooms to suit your team’s needs.</p>

                            </div>

                            {/* Item 2 */}
                            <div className="flex flex-col items-start">
                                <img src="/icon2.png" alt="" className="h-10 w-10" />
                                <h3 className="mt-4 font-semibold text-lg">
                                    Audio and video calls
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    Collaborate efficiently and </p>
                                <p className=" text-sm text-gray-600 leading-relaxed"> seamlessly with high quality
                                    virtual conferencing.
                                </p>
                            </div>

                            {/* Item 3 */}
                            <div className="flex flex-col items-start">
                                <img src="/icon3.png" alt="" className="h-10 w-10" />
                                <h3 className="mt-4 font-semibold text-lg">
                                    Invite guests
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                    Meet with guests without </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                      ever needing to leave your workspace.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default InterectiveRevel
