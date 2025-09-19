import{j as e}from"./iframe-Bh4nsEqh.js";import{B as D}from"./Button-CBFm0qQF.js";import{V as C}from"./v-stack-CfzajWK5.js";import{B as i}from"./box-CLWAhm56.js";import{T as t}from"./text-B9-u84IE.js";import"./index-Cun1SEai.js";import"./button-C6_GMqP-.js";import"./factory-C2D7TBAW.js";const T=()=>{const l=()=>{if(typeof window<"u")try{return getComputedStyle(document.body).fontFamily}catch(z){return console.error(z),"Unable to detect"}return"N/A (SSR)"};return e.jsxs(i,{p:4,bg:"gray.200",border:"1px solid",borderColor:"gray.200",borderRadius:"md",fontSize:"sm",children:[e.jsx(t,{fontWeight:"bold",mb:2,children:"🔍 CSS Debug Info:"}),e.jsxs(C,{align:"start",children:[e.jsxs(t,{children:[e.jsx("strong",{children:"Expected Font:"})," Inter, ui-sans-serif"]}),e.jsxs(t,{children:[e.jsx("strong",{children:"Current computed font:"})," ",e.jsx("span",{style:{fontFamily:"inherit"},children:l()})]}),e.jsxs(t,{children:[e.jsx("strong",{children:"Font Size (this text):"})," ",e.jsx("span",{style:{fontSize:"var(--chakra-font-sizes-md, 1rem)"},children:"1rem (16px)"})]}),e.jsxs(t,{children:[e.jsx("strong",{children:"Background color:"})," ",e.jsx("span",{style:{color:"var(--chakra-colors-yellow-500, #FFC012)"},children:"#FFC012 (yellow.500)"})]}),e.jsxs(i,{mt:2,p:2,border:"1px dashed",borderColor:"gray.300",children:[e.jsx(t,{fontSize:"xs",fontWeight:"bold",children:"Font Test Samples:"}),e.jsx(t,{fontSize:"sm",children:"Small (14px): Sample font size"}),e.jsx(t,{fontSize:"md",children:"Medium (16px): Sample font size"}),e.jsx(t,{fontSize:"lg",children:"Large (18px): Sample font size"})]}),e.jsx(t,{mt:2,fontWeight:"bold",children:"💡 CSS Inspection Tips:"}),e.jsx(t,{fontSize:"xs",color:"gray.600",children:'• Right-click any element → "Inspect Element"'}),e.jsx(t,{fontSize:"xs",color:"gray.600",children:"• In DevTools: Elements tab → Styles panel shows all CSS"}),e.jsx(t,{fontSize:"xs",color:"gray.600",children:"• Computed tab shows final rendered values"}),e.jsx(t,{fontSize:"xs",color:"gray.600",children:"• Use Controls panel below to modify props live"})]})]})},U={title:"UI/Elements/Button",component:D,parameters:{layout:"centered",docs:{description:{component:'Button component with Chakra UI theme integration. Use the browser DevTools to inspect CSS properties, or check the "WithThemeDebugger" story for theme values.'}}},args:{onClick:()=>console.log("Button clicked")},argTypes:{colorPalette:{control:{type:"select"},options:["yellow","black","gray"]},variant:{control:{type:"select"},options:["solid","outline","subtle","ghost"]},size:{control:{type:"select"},options:["xs","sm","md","lg","xl"]},disabled:{control:{type:"boolean"}}}},r={args:{label:"Default Button"}},o={args:{label:"Primary Button",colorPalette:"yellow",variant:"solid"}},s={args:{label:"Outline Button",colorPalette:"yellow",variant:"outline"}},n={args:{label:"Disabled Button",disabled:!0}},a={args:{label:"Button with Debug Info"},render:l=>e.jsxs(C,{children:[e.jsx(D,{...l}),e.jsx(T,{})]}),parameters:{docs:{description:{story:"This story shows the button with theme debugging information to help inspect CSS properties and font settings."}}}};var c,d,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: 'Default Button'
  }
}`,...(m=(d=r.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var p,u,g;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: 'Primary Button',
    colorPalette: 'yellow',
    variant: 'solid'
  }
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,b,x;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: 'Outline Button',
    colorPalette: 'yellow',
    variant: 'outline'
  }
}`,...(x=(b=s.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var f,y,S;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: 'Disabled Button',
    disabled: true
  }
}`,...(S=(y=n.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var j,w,B;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: 'Button with Debug Info'
  },
  render: args => <VStack>
      <Button {...args} />
      <ThemeDebugger />
    </VStack>,
  parameters: {
    docs: {
      description: {
        story: 'This story shows the button with theme debugging information to help inspect CSS properties and font settings.'
      }
    }
  }
}`,...(B=(w=a.parameters)==null?void 0:w.docs)==null?void 0:B.source}}};const R=["Default","Primary","Outline","Disabled","WithThemeDebugger"];export{r as Default,n as Disabled,s as Outline,o as Primary,a as WithThemeDebugger,R as __namedExportsOrder,U as default};
