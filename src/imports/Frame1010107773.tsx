import svgPaths from "./svg-8q4wdqqsbc";

function Text() {
  return (
    <div className="relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Poppins:Regular',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">Avg. Duration</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2006_108)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2006_108">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(16,185,129,0.08)] relative rounded-[6px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[24.2px] not-italic relative shrink-0 text-[22px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">00:23:58</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[16.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular','Noto_Sans_Symbols:Regular',sans-serif] leading-[0] min-w-px relative text-[12px] text-[rgba(0,0,0,0.6)] whitespace-pre-wrap" style={{ fontVariationSettings: "'wght' 400" }}>
        <span className="leading-[16.5px]">{`Per session this period  ·  `}</span>
        <span className="leading-[16.5px] text-[#4023ff]">See long sessions →</span>
      </p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p33b0c200} id="Vector" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p22ad4980} id="Vector_2" stroke="var(--stroke-0, #059669)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon1 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[#059669] text-[11px] whitespace-nowrap">3% vs last week</p>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[16px] relative size-full">
        <Container1 />
        <Container3 />
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[10px] size-full">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-[-1px] pointer-events-none rounded-[11px]" />
      <Container />
    </div>
  );
}