import svgPaths from "./svg-7eft0gwgfq";

function Text() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Text">
      <p className="font-['Poppins:Regular',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">Quality Alert</p>
    </div>
  );
}

function AlertTriangle() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alert triangle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alert triangle">
          <path d={svgPaths.p32a57b00} id="Icon" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#ffefef] content-stretch flex gap-[4px] items-center justify-center px-[6px] py-[4px] relative rounded-[4px] shrink-0" data-name="Text">
      <AlertTriangle />
      <p className="font-['Poppins:SemiBold',sans-serif] leading-[13.5px] not-italic relative shrink-0 text-[#dc2626] text-[12px] whitespace-nowrap">NEEDS ATTENTION</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function AlertTriangle1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alert triangle">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alert triangle">
          <path d={svgPaths.p32a57b00} id="Icon" stroke="var(--stroke-0, #DC2626)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#ffefef] relative rounded-[6px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <AlertTriangle1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Frame />
      <Container3 />
    </div>
  );
}

function Text2() {
  return (
    <div className="relative rounded-[4px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Poppins:SemiBold',sans-serif] leading-[24.2px] not-italic relative shrink-0 text-[22px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">en-US</p>
      </div>
    </div>
  );
}

function IconChevronRight() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon Chevron Right">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon Chevron Right">
          <path d="M6.75 13.5L11.25 9L6.75 4.5" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="relative rounded-[4px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Poppins:SemiBold',sans-serif] leading-[24.2px] not-italic relative shrink-0 text-[22px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">nl-BE</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Text2 />
      <IconChevronRight />
      <Text3 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[4px] h-[16.5px] items-start leading-[16.5px] min-w-px not-italic relative whitespace-nowrap" data-name="Container">
      <p className="font-['Poppins:SemiBold',sans-serif] relative shrink-0 text-[10px] text-[rgba(0,0,0,0.6)]">AI Voice Off</p>
      <p className="font-['Poppins:SemiBold',sans-serif] relative shrink-0 text-[#dc2626] text-[12px]">51%</p>
      <p className="font-['Poppins:SemiBold','Noto_Sans_JP:Bold',sans-serif] relative shrink-0 text-[10px] text-[rgba(0,0,0,0.6)]">・</p>
      <p className="font-['Poppins:SemiBold',sans-serif] relative shrink-0 text-[10px] text-[rgba(0,0,0,0.6)]">Conf.</p>
      <p className="font-['Poppins:SemiBold',sans-serif] relative shrink-0 text-[#f59e0b] text-[12px]">71%</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[16.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Poppins:Regular',sans-serif] leading-[16.5px] min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.6)]">13 sessions this period</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <p className="font-['Poppins:Medium','Noto_Sans:Medium',sans-serif] leading-[16.5px] relative shrink-0 text-[#4023ff] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 500" }}>
        Review pair →
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#dc2626] border-solid border-t-3 inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[16px] relative size-full">
        <Container2 />
        <Container4 />
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-[10px] size-full" data-name="container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-l border-r border-solid inset-[0_-1px_-1px_-1px] pointer-events-none rounded-bl-[11px] rounded-br-[11px] rounded-tl-[10px] rounded-tr-[10px]" />
      <Container1 />
    </div>
  );
}