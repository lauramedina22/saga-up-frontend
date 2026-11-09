// Ilustraciones vectoriales independientes para las plataformas del ecosistema UP

export function ServiceIllustration({ serviceId }) {
  switch (serviceId) {
    case "asisconnection":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E7F7F5] to-[#D0F0EC]">
          <div className="absolute size-28 rounded-full bg-[#008375]/10 animate-pulse" />
          <div className="absolute size-20 rounded-full bg-[#F2A900]/15" />
          <svg
            className="relative size-20 text-[#008375]"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="30" r="10" fill="#008375" />
            <path
              d="M24 58C24 49.1634 31.1634 42 40 42C48.8366 42 56 49.1634 56 58V62H24V58Z"
              fill="#008375"
            />
            <circle cx="18" cy="36" r="7" fill="#E87722" />
            <path
              d="M8 58C8 51.3726 13.3726 46 20 46C22.4 46 24.6 46.7 26.5 48C25 50.8 24 54.2 24 58H8Z"
              fill="#E87722"
              fillOpacity="0.85"
            />
            <circle cx="62" cy="36" r="7" fill="#F2A900" />
            <path
              d="M60 46C66.6274 46 72 51.3726 72 58H56C56 54.2 55 50.8 53.5 48C55.4 46.7 57.6 46 60 46Z"
              fill="#F2A900"
              fillOpacity="0.9"
            />
            <circle cx="40" cy="14" r="3" fill="#E87722" />
            <path
              d="M20 25L32 18M60 25L48 18"
              stroke="#008375"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      )

    case "suma21":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4E3] to-[#FCE3B4]/60">
          <div className="absolute size-28 rounded-full bg-[#E87722]/10" />
          <div className="absolute size-18 rounded-full bg-[#F2A900]/20" />
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="18" y="32" width="44" height="34" rx="6" fill="#E87722" />
            <rect x="14" y="26" width="52" height="10" rx="4" fill="#F2A900" />
            <path
              d="M36 26V36M44 26V36"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M40 22C40 22 34 16 29 16C24 16 20 20 20 25C20 32 40 44 40 44C40 44 60 32 60 25C60 20 56 16 51 16C46 16 40 22 40 22Z"
              fill="#008375"
            />
            <circle cx="40" cy="48" r="9" fill="#F2A900" />
            <path
              d="M40 43V53M36.5 45.5C36.5 45.5 38 44.5 40 44.5C42 44.5 43.5 45.5 43.5 47C43.5 50 36.5 49 36.5 51.5C36.5 53 38 54 40 54C42 54 43.5 53 43.5 53"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    case "aulaup":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]">
          <div className="absolute size-28 rounded-full bg-[#F2A900]/15" />
          <div className="absolute size-20 rounded-full bg-[#008375]/10" />
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M40 14L16 26L40 38L64 26L40 14Z" fill="#008375" />
            <path
              d="M58 29.5V42C58 42 51 47 40 47C29 47 22 42 22 42V29.5"
              stroke="#008375"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M64 26V40"
              stroke="#E87722"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="64" cy="42" r="3" fill="#E87722" />
            <path
              d="M40 50C33 46 22 47 16 50V68C22 65 33 64 40 67C47 64 58 65 64 68V50C58 47 47 46 40 50Z"
              fill="#E87722"
            />
            <path d="M40 50V67" stroke="#FFFFFF" strokeWidth="2.5" />
            <path
              d="M24 56H34M24 61H32M46 56H56M48 61H56"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    case "sonup":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E7F7F5] to-[#D5EFEA]">
          <div className="absolute size-28 rounded-full bg-[#008375]/15" />
          <div className="absolute size-18 rounded-full bg-[#E87722]/15" />
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="18" y="46" width="9" height="20" rx="3" fill="#008375" fillOpacity="0.5" />
            <rect x="31" y="36" width="9" height="30" rx="3" fill="#008375" fillOpacity="0.8" />
            <rect x="44" y="26" width="9" height="40" rx="3" fill="#008375" />
            <rect x="57" y="16" width="9" height="50" rx="3" fill="#E87722" />
            <path
              d="M16 42L33 30L46 36L64 14"
              stroke="#F2A900"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M52 14H64V26"
              stroke="#F2A900"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="64" cy="14" r="5" fill="#F2A900" />
          </svg>
        </div>
      )

    case "lupe":
      return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFF4E3] to-[#FCE3B4]/70">
          <div className="absolute size-28 rounded-full bg-[#E87722]/15 animate-pulse" />
          <div className="absolute size-20 rounded-full bg-[#008375]/15" />
          <svg
            className="relative size-20"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="22" y="26" width="36" height="36" rx="10" fill="#008375" />
            <circle cx="33" cy="40" r="4.5" fill="#F2A900" />
            <circle cx="47" cy="40" r="4.5" fill="#F2A900" />
            <path
              d="M34 50C36 52 38 53 40 53C42 53 44 52 46 50"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path d="M40 26V18" stroke="#008375" strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="14" r="5" fill="#E87722" />
            <path
              d="M64 26L60 30M64 34L60 30M60 30H68"
              stroke="#E87722"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 26L20 30M16 34L20 30M20 30H12"
              stroke="#F2A900"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )

    default:
      return null
  }
}

