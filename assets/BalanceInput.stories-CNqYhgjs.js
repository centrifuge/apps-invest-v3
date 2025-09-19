var Xe=Object.defineProperty;var er=(n,t,e)=>t in n?Xe(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var A=(n,t,e)=>er(n,typeof t!="symbol"?t+"":t,e);import{r as x,j as r,c as rr}from"./iframe-Bh4nsEqh.js";import{u as nr,a as tr,b as ar,c as sr,F as or}from"./useGetFormError-B0Jma713.js";import{D as H}from"./decimal-DQE-3iDJ.js";import{F as ir}from"./flex-BcYWbRrC.js";import{u as lr,T as Q}from"./text-B9-u84IE.js";import{c as X,E as cr}from"./factory-C2D7TBAW.js";import{d as Z,F as ie,a as le,b as ce}from"./field-ONEhZa_b.js";import{I as ue}from"./input-CgKadtz6.js";import{B as ur}from"./button-C6_GMqP-.js";import{N as dr,a as mr,b as pr}from"./native-select-OHRTiX0W.js";import{B as gr}from"./box-CLWAhm56.js";import"./index-Cun1SEai.js";import"./create-slot-recipe-context-DgHzcxly.js";import"./icon-Czktae-r.js";import"./use-field-context-DpjkteSV.js";import"./create-split-props-BLHDZ2ef.js";const fr=X("div",{base:{display:"inline-flex",gap:"0.5rem",isolation:"isolate",position:"relative","& [data-group-item]":{_focusVisible:{zIndex:1}}},variants:{orientation:{horizontal:{flexDirection:"row"},vertical:{flexDirection:"column"}},attached:{true:{gap:"0!"}},grow:{true:{display:"flex","& > *":{flex:1}}},stacking:{"first-on-top":{"& > [data-group-item]":{zIndex:"calc(var(--group-count) - var(--group-index))"}},"last-on-top":{"& > [data-group-item]":{zIndex:"var(--group-index)"}}}},compoundVariants:[{orientation:"horizontal",attached:!0,css:{"& > *[data-first]":{borderEndRadius:"0!",marginEnd:"-1px"},"& > *[data-between]":{borderRadius:"0!",marginEnd:"-1px"},"& > *[data-last]":{borderStartRadius:"0!"}}},{orientation:"vertical",attached:!0,css:{"& > *[data-first]":{borderBottomRadius:"0!",marginBottom:"-1px"},"& > *[data-between]":{borderRadius:"0!",marginBottom:"-1px"},"& > *[data-last]":{borderTopRadius:"0!"}}}],defaultVariants:{orientation:"horizontal"}}),Ge=x.memo(x.forwardRef(function(t,e){const{align:a="center",justify:i="flex-start",children:h,wrap:b,skip:l,...B}=t,D=x.useMemo(()=>{let p=x.Children.toArray(h).filter(x.isValidElement);if(p.length===1)return p;const S=p.filter(u=>!(l!=null&&l(u))),y=S.length;return S.length===1?p:p.map(u=>{const v=u.props;if(l!=null&&l(u))return u;const d=S.indexOf(u);return x.cloneElement(u,{...v,"data-group-item":"","data-first":Z(d===0),"data-last":Z(d===y-1),"data-between":Z(d>0&&d<y-1),style:{"--group-count":y,"--group-index":d,...(v==null?void 0:v.style)??{}}})})},[h,l]);return r.jsx(fr,{ref:e,alignItems:a,justifyContent:i,flexWrap:b,...B,className:rr("chakra-group",t.className),children:D})})),de=x.forwardRef(function({unstyled:t,...e},a){const i=lr({key:"inputAddon",recipe:e.recipe}),[h,b]=i.splitVariantProps(e),l=t?cr:i(h);return r.jsx(X.div,{ref:a,...b,css:[l,e.css]})}),J=X("div",{base:{display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",zIndex:2,color:"fg.muted",height:"full",fontSize:"sm",px:"3"},variants:{placement:{start:{insetInlineStart:"0"},end:{insetInlineEnd:"0"}}}}),hr=x.forwardRef(function(t,e){const{startElement:a,startElementProps:i,endElement:h,endElementProps:b,startAddon:l,startAddonProps:B,endAddon:D,endAddonProps:p,children:S,startOffset:y="0px",endOffset:u="0px",...v}=t,d=x.Children.only(S),T=!!(l||D);return r.jsxs(Ge,{width:"full",ref:e,attached:T,skip:$=>$.type===J,...v,children:[l&&r.jsx(de,{...B,children:l}),a&&r.jsx(J,{pointerEvents:"none",...i,children:a}),x.cloneElement(d,{...a&&{ps:`calc(var(--input-height) - ${y})`},...h&&{pe:`calc(var(--input-height) - ${u})`},...S.props}),h&&r.jsx(J,{placement:"end",...b,children:h}),D&&r.jsx(de,{...p,children:D})]})}),w=H.default||H;w.set({precision:30,toExpNeg:-7,toExpPos:29,rounding:w.ROUND_HALF_CEIL});function g(n){return new w(n)}class br{constructor(t){A(this,"value");typeof t=="bigint"?this.value=t:t instanceof w?this.value=BigInt(t.toFixed(0)):typeof t=="number"?this.value=BigInt(Math.floor(t)):this.value=BigInt(String(t).split(".")[0]||"0")}toString(){return this.value.toString()}toBigInt(){return this.value}}class yr extends br{constructor(e,a){super(e);A(this,"decimals");this.decimals=a}static _fromFloat(e,a){const i=g(e.toString()).mul(g(10).pow(a));if(g(i).gt(0)&&g(i).lt(1))throw new Error(`${e} is too small to be represented with ${a} decimals`);return new this(i.toDecimalPlaces(0),a)}toDecimal(){return g(this.value.toString()).div(g(10).pow(this.decimals))}toFloat(){return this.toDecimal().toNumber()}scale(e){return e===this.decimals?this:E.fromFloat(this.toDecimal(),e)}_add(e){const a=typeof e=="bigint"?e:e.toBigInt();return new this.constructor(this.value+a,this.decimals)}_sub(e){const a=typeof e=="bigint"?e:e.toBigInt();return this._add(-a)}_mul(e){let a;return typeof e=="bigint"?a=g(e.toString()):e instanceof w?a=e.mul(g(10).pow(this.decimals)):a=e.toDecimal().mul(g(10).pow(this.decimals)),new this.constructor(this.toDecimal().mul(a),this.decimals)}_div(e){if(!e)throw new Error("Division by zero");return typeof e=="bigint"?new this.constructor(this.value/e,this.decimals):e instanceof w?new this.constructor(this.value/BigInt(e.mul(g(10).pow(this.decimals)).toDecimalPlaces(0).toString()),this.decimals):new this.constructor(this.value/e.toBigInt(),this.decimals)}lt(e){const a=typeof e=="bigint"?e:e.toBigInt();return this.value<a}lte(e){const a=typeof e=="bigint"?e:e.toBigInt();return this.value<=a}gt(e){const a=typeof e=="bigint"?e:e.toBigInt();return this.value>a}gte(e){const a=typeof e=="bigint"?e:e.toBigInt();return this.value>=a}eq(e){const a=typeof e=="bigint"?e:e.toBigInt();return this.value===a}isZero(){return this.value===0n}}const V=class V extends yr{static fromFloat(t,e){return V._fromFloat(t,e)}add(t){return this._add(t)}sub(t){return this._sub(t)}mul(t){return this._mul(t)}div(t){return this._div(t)}};A(V,"ZERO",new V(0n,0));let E=V;g(3600*24*365);const me=["sm","md","lg","xl","2xl","2xs","xs"],xr=({options:n,onChange:t})=>n.length===0?null:r.jsxs(dr,{size:"xs",variant:"plain",width:"auto",me:"-1",children:[r.jsx(mr,{fontSize:"sm",onChange:e=>t(e.target.value),bg:"white",children:n.map(e=>r.jsx("option",{value:e.value,children:e.label},e.value))}),r.jsx(pr,{})]});function c(n){const{currency:t,disabled:e,inputGroupProps:a,name:i,rules:h,onChange:b,onBlur:l,decimals:B=6,displayDecimals:D,selectOptions:p,onSelectChange:S,label:y,subLabel:u,buttonLabel:v,size:d="2xl",fontSize:T="2xl",onButtonClick:$,defaultValue:Me,...G}=n,F=D||B,{control:Ke,trigger:Ye}=nr(),{field:C,fieldState:{error:Ze},formState:Je}=tr({name:i,control:Ke,rules:h}),M=(o,s)=>{if(!o||o===""||o===".")return o;const m=o.split(".");if(m.length<=1)return o;const j=m[1].slice(0,s);return`${m[0]}.${j}`},ee=o=>{let s="";return o instanceof E?s=o.toFloat().toString():typeof o=="number"?s=o.toString():typeof o=="string"&&(s=o),M(s,F)},K=o=>{let s=o.target.value;if((s===""||s==="."||/^\d*\.?\d*$/.test(s))&&(s=M(s,F),o.target.value=s,C.onChange(s),b))try{const m=parseFloat(s);if(!isNaN(m)&&s!==""&&s!=="."){const j=E.fromFloat(m,B);b(s,j)}else b(s)}catch{b(s)}},re=o=>{const s=o.target.value;if(s&&s!==""&&s!=="."){const I=new H(s).toDecimalPlaces(F,H.ROUND_DOWN).toString();C.onChange(I)}C.onBlur(),Ye(i),l&&l(o)},ne=o=>{o.preventDefault();const m=o.clipboardData.getData("text").replace(/[^0-9.]/g,"");if(/^\d*\.?\d*$/.test(m)){const I={target:{value:M(m,F)}};K(I)}},te=o=>{const{key:s,ctrlKey:m,metaKey:j}=o,I=o.target.value;if(!((m||j)&&["a","c","v","x","z","y"].includes(s.toLowerCase()))&&!["Backspace","Delete","Tab","Escape","Enter","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(s)){if(!/[\d.]/.test(s)){o.preventDefault();return}if(s==="."&&I.includes(".")){o.preventDefault();return}if(I.includes(".")){const oe=I.split(".")[1];if(oe&&oe.length>=F&&s!=="."){o.preventDefault();return}}}},{isError:Y,errorMessage:ae}=ar({error:Ze,name:i}),se=Je.isSubmitting||e,Qe=typeof d=="string"?me.indexOf(d):1;return v?r.jsxs(ie,{invalid:Y,children:[y&&r.jsx(le,{children:y}),r.jsxs(Ge,{attached:!0,border:"1px solid",borderColor:Y?"red.500":"gray.200",borderRadius:"md",children:[r.jsx(ue,{id:i,name:i,ref:C.ref,type:"text",value:ee(C.value),disabled:se,onChange:K,onBlur:re,onKeyDown:te,onPaste:ne,inputMode:"decimal",variant:"subtle",defaultValue:Me,border:"transparent",borderRadius:"lg",size:d,fontSize:T,_focusVisible:{borderColor:"transparent"},backgroundColor:"gray.300",...G}),t&&r.jsx(Q,{marginRight:2,children:t}),r.jsx(ur,{variant:"plain",size:me[Qe+1],backgroundColor:"gray.300",color:"fg.muted",onClick:$,borderRadius:"none",children:v})]}),r.jsx(ce,{children:ae})]}):r.jsxs(ie,{invalid:Y,children:[r.jsxs(ir,{alignItems:"center",gap:2,children:[y&&r.jsx(le,{children:y}),u&&r.jsx(Q,{fontSize:"sm",color:"fg.subtle",children:u})]}),r.jsx(hr,{...a,endElement:p&&p.length>0?r.jsx(xr,{options:p,onChange:o=>{S&&S(o)}}):t||void 0,children:r.jsx(ue,{id:i,name:i,ref:C.ref,type:"text",value:ee(C.value),disabled:se,onChange:K,onBlur:re,onKeyDown:te,onPaste:ne,inputMode:"decimal",variant:G.variant??"outline",borderRadius:"lg",size:d,fontSize:T,backgroundColor:"gray.300",...G})}),r.jsx(ce,{children:ae})]})}c.__docgenInfo={description:"",methods:[],displayName:"BalanceInput",props:{currency:{required:!1,tsType:{name:"union",raw:"string | ReactNode",elements:[{name:"string"},{name:"ReactNode"}]},description:""},name:{required:!0,tsType:{name:"FieldPath",elements:[{name:"TFieldValues"}],raw:"FieldPath<TFieldValues>"},description:""},label:{required:!1,tsType:{name:"string"},description:""},rules:{required:!1,tsType:{name:"object"},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},decimals:{required:!1,tsType:{name:"number"},description:""},displayDecimals:{required:!1,tsType:{name:"number"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string, balance?: Balance) => void",signature:{arguments:[{type:{name:"string"},name:"value"},{type:{name:"Balance"},name:"balance"}],return:{name:"void"}}},description:""},onBlur:{required:!1,tsType:{name:"ReactFocusEventHandler",raw:"React.FocusEventHandler<HTMLInputElement>",elements:[{name:"HTMLInputElement"}]},description:""},inputGroupProps:{required:!1,tsType:{name:"Omit",elements:[{name:"InputGroupProps"},{name:"literal",value:"'children'"}],raw:"Omit<InputGroupProps, 'children'>"},description:""},selectOptions:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ label: string; value: number | string }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"value",value:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}],required:!0}}]}}],raw:"{ label: string; value: number | string }[]"},description:""},onSelectChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number | string) => void",signature:{arguments:[{type:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},name:"value"}],return:{name:"void"}}},description:""},subLabel:{required:!1,tsType:{name:"string"},description:""},buttonLabel:{required:!1,tsType:{name:"string"},description:""},onButtonClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}},composes:["Omit"]};const Lr={title:"Forms/Components/BalanceInput",component:c,parameters:{layout:"padded"},argTypes:{currency:{control:{type:"text"}},label:{control:{type:"text"}},subLabel:{control:{type:"text"}},buttonLabel:{control:{type:"text"}},disabled:{control:{type:"boolean"}},decimals:{control:{type:"number",min:0,max:18}},displayDecimals:{control:{type:"number",min:0,max:18}},size:{control:{type:"select"},options:["2xs","xs","sm","md","lg","xl","2xl"]}},args:{onChange:n=>console.log("Value changed:",n),onBlur:()=>console.log("Input blurred"),onSelectChange:n=>console.log("Select changed:",n),onButtonClick:()=>console.log("Button clicked")}},f=({children:n,defaultValues:t={}})=>{const e=sr({defaultValues:t});return r.jsx(or,{...e,children:r.jsxs("form",{children:[r.jsx("div",{style:{maxWidth:"400px",background:"white",padding:"2rem",borderRadius:"10px"},children:n}),r.jsx(gr,{mt:4,children:r.jsxs(Q,{fontSize:"sm",color:"gray.600",children:["Current form values: ",JSON.stringify(e.watch(),null,2)]})})]})})},W={render:n=>r.jsx(f,{defaultValues:{amount:""},children:r.jsx(c,{...n})}),args:{name:"amount",label:"Amount",currency:"USDC"}},R={render:n=>r.jsx(f,{defaultValues:{investment:""},children:r.jsx(c,{...n})}),args:{name:"investment",label:"Investment Amount",currency:"USDC"}},P={render:n=>r.jsx(f,{defaultValues:{balance:""},children:r.jsx(c,{...n})}),args:{name:"balance",label:"Account Balance",subLabel:"Available: $1,234.56",currency:"USDC"}},z={render:n=>r.jsx(f,{defaultValues:{payment:""},children:r.jsx(c,{...n})}),args:{name:"payment",label:"Payment Amount",selectOptions:[{label:"USDC",value:"USDC"},{label:"ETH",value:"ETH"},{label:"BTC",value:"BTC"}]}},L={render:n=>r.jsx(f,{defaultValues:{readonly:"123.45"},children:r.jsx(c,{...n})}),args:{name:"readonly",label:"Read-only Amount",currency:"USDC",disabled:!0}},q={render:n=>r.jsx(f,{defaultValues:{crypto:""},children:r.jsx(c,{...n})}),args:{name:"crypto",label:"Crypto Amount",currency:"BTC",decimals:18,displayDecimals:18}},U={render:n=>r.jsx(f,{defaultValues:{simple:""},children:r.jsx(c,{...n})}),args:{name:"simple",label:"Simple Amount",currency:"USDC",decimals:2,displayDecimals:2}},O={render:n=>r.jsx(f,{defaultValues:{small:""},children:r.jsx(c,{...n})}),args:{name:"small",label:"Small Input",currency:"USDC",size:"sm"}},_={render:n=>r.jsx(f,{defaultValues:{large:""},children:r.jsx(c,{...n})}),args:{name:"large",label:"Large Input",currency:"USDC",size:"lg"}},N={render:n=>r.jsx(f,{defaultValues:{validated:""},children:r.jsx(c,{...n})}),args:{name:"validated",label:"Amount (Required)",currency:"USDC",rules:{required:"Amount is required"}}},k={render:n=>r.jsx(f,{defaultValues:{prefilled:"1234.56"},children:r.jsx(c,{...n})}),args:{name:"prefilled",label:"Prefilled Amount",currency:"USDC"}};var pe,ge,fe;W.parameters={...W.parameters,docs:{...(pe=W.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    amount: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'amount',
    label: 'Amount',
    currency: 'USDC'
  }
}`,...(fe=(ge=W.parameters)==null?void 0:ge.docs)==null?void 0:fe.source}}};var he,be,ye;R.parameters={...R.parameters,docs:{...(he=R.parameters)==null?void 0:he.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    investment: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'investment',
    label: 'Investment Amount',
    currency: 'USDC'
  }
}`,...(ye=(be=R.parameters)==null?void 0:be.docs)==null?void 0:ye.source}}};var xe,Se,ve;P.parameters={...P.parameters,docs:{...(xe=P.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    balance: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'balance',
    label: 'Account Balance',
    subLabel: 'Available: $1,234.56',
    currency: 'USDC'
  }
}`,...(ve=(Se=P.parameters)==null?void 0:Se.docs)==null?void 0:ve.source}}};var De,Ce,je;z.parameters={...z.parameters,docs:{...(De=z.parameters)==null?void 0:De.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    payment: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'payment',
    label: 'Payment Amount',
    selectOptions: [{
      label: 'USDC',
      value: 'USDC'
    }, {
      label: 'ETH',
      value: 'ETH'
    }, {
      label: 'BTC',
      value: 'BTC'
    }]
  }
}`,...(je=(Ce=z.parameters)==null?void 0:Ce.docs)==null?void 0:je.source}}};var Ie,Be,we;L.parameters={...L.parameters,docs:{...(Ie=L.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    readonly: '123.45'
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'readonly',
    label: 'Read-only Amount',
    currency: 'USDC',
    disabled: true
  }
}`,...(we=(Be=L.parameters)==null?void 0:Be.docs)==null?void 0:we.source}}};var Fe,Ve,Ee;q.parameters={...q.parameters,docs:{...(Fe=q.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    crypto: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'crypto',
    label: 'Crypto Amount',
    currency: 'BTC',
    decimals: 18,
    displayDecimals: 18
  }
}`,...(Ee=(Ve=q.parameters)==null?void 0:Ve.docs)==null?void 0:Ee.source}}};var Te,Ae,We;U.parameters={...U.parameters,docs:{...(Te=U.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    simple: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'simple',
    label: 'Simple Amount',
    currency: 'USDC',
    decimals: 2,
    displayDecimals: 2
  }
}`,...(We=(Ae=U.parameters)==null?void 0:Ae.docs)==null?void 0:We.source}}};var Re,Pe,ze;O.parameters={...O.parameters,docs:{...(Re=O.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    small: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'small',
    label: 'Small Input',
    currency: 'USDC',
    size: 'sm'
  }
}`,...(ze=(Pe=O.parameters)==null?void 0:Pe.docs)==null?void 0:ze.source}}};var Le,qe,Ue;_.parameters={..._.parameters,docs:{...(Le=_.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    large: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'large',
    label: 'Large Input',
    currency: 'USDC',
    size: 'lg'
  }
}`,...(Ue=(qe=_.parameters)==null?void 0:qe.docs)==null?void 0:Ue.source}}};var Oe,_e,Ne;N.parameters={...N.parameters,docs:{...(Oe=N.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    validated: ''
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'validated',
    label: 'Amount (Required)',
    currency: 'USDC',
    rules: {
      required: 'Amount is required'
    }
  }
}`,...(Ne=(_e=N.parameters)==null?void 0:_e.docs)==null?void 0:Ne.source}}};var ke,He,$e;k.parameters={...k.parameters,docs:{...(ke=k.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    prefilled: '1234.56'
  }}>
      <BalanceInput {...args} />
    </FormWrapper>,
  args: {
    name: 'prefilled',
    label: 'Prefilled Amount',
    currency: 'USDC'
  }
}`,...($e=(He=k.parameters)==null?void 0:He.docs)==null?void 0:$e.source}}};const qr=["Default","WithLabel","WithSubLabel","WithSelectOptions","Disabled","HighDecimals","LowDecimals","SmallSize","LargeSize","WithValidation","PrefilledValue"];export{W as Default,L as Disabled,q as HighDecimals,_ as LargeSize,U as LowDecimals,k as PrefilledValue,O as SmallSize,R as WithLabel,z as WithSelectOptions,P as WithSubLabel,N as WithValidation,qr as __namedExportsOrder,Lr as default};
