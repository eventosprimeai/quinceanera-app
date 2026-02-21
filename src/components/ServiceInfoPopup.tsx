import { X, CheckCircle2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PopupInfo {
    shortText: string;
    buttonText: string;
    title: string;
    imageQuery?: string;
    includedText: string[];
    factorsText?: string[];
    realValueText?: string;
    mainImage?: string;
    galleryImages?: string[];
}

interface Props {
    info: PopupInfo;
    onClose: () => void;
}

export default function ServiceInfoPopup({ info, onClose }: Props) {
    const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);

    const allImages = [info.mainImage, ...(info.galleryImages || [])].filter(Boolean) as string[];

    // Prevent scrolling behind modal
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-[#0a0a0a] border border-[#2a2a2a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a] bg-[#141414]">
                    <h3 className="text-xl font-bold text-white pr-4" style={{ fontFamily: 'var(--font-serif)' }}>
                        {info.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-[#888] hover:text-white transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">
                    {/* Main Image Header (Optional) */}
                    {info.mainImage && (
                        <div
                            className="relative w-full h-64 md:h-72 shrink-0 border-b border-[#2a2a2a] cursor-pointer group"
                            onClick={() => setExpandedImageIndex(0)}
                        >
                            <Image
                                src={info.mainImage}
                                alt={info.title}
                                fill
                                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>
                    )}

                    <div className="p-5 space-y-6">
                        {/* Short Text Intro */}
                        <p className="text-[#aaa] text-sm leading-relaxed">
                            {info.shortText}
                        </p>

                        {/* Includes Section */}
                        {info.includedText && info.includedText.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-[#c9a96e] mb-3 uppercase tracking-wider text-[11px]">
                                    ¿Qué incluye generalmente?
                                </h4>
                                <ul className="space-y-2">
                                    {info.includedText.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-[#ddd]">
                                            <CheckCircle2 className="w-4 h-4 text-[#c9a96e]/60 mt-0.5 flex-shrink-0" />
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Factors Section */}
                        {info.factorsText && info.factorsText.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-[#c9a96e] mb-3 uppercase tracking-wider text-[11px]">
                                    Qué influye en el precio
                                </h4>
                                <ul className="list-disc pl-4 space-y-1.5 marker:text-[#555]">
                                    {info.factorsText.map((item, idx) => (
                                        <li key={idx} className="text-sm text-[#aaa]">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Real Value Section */}
                        {info.realValueText && (
                            <div className="bg-[#c9a96e]/10 border border-[#c9a96e]/20 p-4 rounded-xl">
                                <h4 className="text-sm font-semibold text-[#c9a96e] mb-1">
                                    Valor Real
                                </h4>
                                <p className="text-sm text-[#eee] leading-relaxed">
                                    {info.realValueText}
                                </p>
                            </div>
                        )}

                        {/* Reference Gallery Section */}
                        {info.galleryImages && info.galleryImages.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-[#c9a96e] mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Galería de Referencias ({info.galleryImages.length})
                                </h4>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {info.galleryImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative w-full h-32 rounded-lg overflow-hidden border border-[#2a2a2a] cursor-pointer"
                                            onClick={() => setExpandedImageIndex(info.mainImage ? idx + 1 : idx)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Referencia ${idx + 1}`}
                                                fill
                                                className="object-cover object-top hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#2a2a2a] bg-[#141414] mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full btn-gold !py-3 justify-center text-sm font-semibold"
                    >
                        Entendido
                    </button>
                </div>
            </div>

            {/* Lightbox / Expanded Image Overlay */}
            {expandedImageIndex !== null && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 animate-in fade-in duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpandedImageIndex(null);
                    }}
                >
                    {/* Top Bar with Clear Close Button */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-end z-[70] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpandedImageIndex(null);
                            }}
                            className="bg-[#1e1e1e] hover:bg-[#c9a96e] text-white hover:text-black flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shadow-2xl border border-white/20 pointer-events-auto"
                        >
                            <span className="text-sm font-bold uppercase tracking-wider">Cerrar Galería</span>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedImageIndex((prev) => prev! === 0 ? allImages.length - 1 : prev! - 1);
                                }}
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#c9a96e] text-white hover:text-black flex items-center justify-center transition-all z-[70] backdrop-blur-md border border-white/20"
                            >
                                <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedImageIndex((prev) => prev! === allImages.length - 1 ? 0 : prev! + 1);
                                }}
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#c9a96e] text-white hover:text-black flex items-center justify-center transition-all z-[70] backdrop-blur-md border border-white/20"
                            >
                                <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
                            </button>
                        </>
                    )}

                    <div
                        className="relative w-full max-w-6xl aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={allImages[expandedImageIndex]}
                            alt={`Referencia completada`}
                            fill
                            className="object-contain"
                            quality={100}
                        />

                        {/* Image Counter */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1.5 rounded-full text-white text-sm font-semibold backdrop-blur-md border border-white/10">
                                {expandedImageIndex + 1} / {allImages.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
