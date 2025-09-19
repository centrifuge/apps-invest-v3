import{j as e,r as N}from"./iframe-Bh4nsEqh.js";import{M as O}from"./Modal-BIRCwTzW.js";import{T as t}from"./text-B9-u84IE.js";import{V as R}from"./v-stack-CfzajWK5.js";import{I as p}from"./input-CgKadtz6.js";import{B as Y}from"./button-C6_GMqP-.js";import"./index-Cun1SEai.js";import"./index-Bf1ftP2J.js";import"./index-BskpfAr_.js";import"./use-event-KVpjCCBj.js";import"./create-split-props-BLHDZ2ef.js";import"./factory-C2D7TBAW.js";import"./create-slot-recipe-context-DgHzcxly.js";import"./render-strategy-D2qL0-Ht.js";import"./use-field-context-DpjkteSV.js";const ie={title:"UI/Elements/Modal",component:O,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},title:{control:{type:"text"}},primaryActionText:{control:{type:"text"}},isPrimaryActionLoading:{control:{type:"boolean"}},isPrimaryActionDisabled:{control:{type:"boolean"}},size:{control:{type:"select"},options:["xs","sm","md","lg","xl","full"]}},args:{onClose:()=>console.log("Modal closed"),onPrimaryAction:()=>console.log("Primary action clicked")}},o=({children:r,...w})=>{const[B,u]=N.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(Y,{onClick:()=>u(!0),children:"Open Modal"}),e.jsx(O,{...w,title:"Example Modal",isOpen:B,onClose:()=>u(!1),onPrimaryAction:()=>{console.log("Primary action clicked"),u(!1)},children:r})]})},a={render:r=>e.jsx(o,{...r,children:e.jsx(t,{children:"This is the default modal content. It demonstrates the basic modal functionality."})}),args:{title:"Default Modal",primaryActionText:"Save changes"}},i={render:r=>e.jsx(o,{...r,children:e.jsx(t,{children:"This modal doesn't have a primary action button, only the close button."})}),args:{title:"Information Modal",onPrimaryAction:void 0}},n={render:r=>e.jsx(o,{...r,children:e.jsxs(R,{align:"stretch",children:[e.jsxs("div",{children:[e.jsx(t,{mb:2,fontSize:"sm",fontWeight:"medium",children:"Name"}),e.jsx(p,{placeholder:"Enter your name"})]}),e.jsxs("div",{children:[e.jsx(t,{mb:2,fontSize:"sm",fontWeight:"medium",children:"Email"}),e.jsx(p,{placeholder:"Enter your email",type:"email"})]}),e.jsxs("div",{children:[e.jsx(t,{mb:2,fontSize:"sm",fontWeight:"medium",children:"Message"}),e.jsx(p,{placeholder:"Enter your message"})]})]})}),args:{title:"Contact Form",primaryActionText:"Submit"}},s={render:r=>e.jsx(o,{...r,children:e.jsx(t,{children:"This modal shows the loading state of the primary action button."})}),args:{title:"Processing Request",primaryActionText:"Processing...",isPrimaryActionLoading:!0}},l={render:r=>e.jsx(o,{...r,children:e.jsx(t,{children:"The primary action button is disabled until certain conditions are met."})}),args:{title:"Confirmation Required",primaryActionText:"Confirm",isPrimaryActionDisabled:!0}},m={render:r=>e.jsx(o,{...r,children:e.jsxs(R,{align:"stretch",children:[e.jsx(t,{fontSize:"lg",fontWeight:"semibold",children:"Large Modal Content"}),e.jsx(t,{children:"This is a large modal that can accommodate more content. It's useful for complex forms, detailed information, or when you need more space to display data."}),e.jsx(t,{children:"You can add multiple sections, forms, tables, or any other components that require more screen real estate."}),e.jsxs("div",{children:[e.jsx(t,{mb:2,fontSize:"sm",fontWeight:"medium",children:"Additional Form Field"}),e.jsx(p,{placeholder:"More form inputs can be added here"})]})]})}),args:{title:"Large Modal Example",primaryActionText:"Save All Changes",size:"lg"}},c={render:r=>e.jsx(o,{...r,children:e.jsx(t,{children:"This is a smaller modal for simple confirmations or brief messages."})}),args:{title:"Confirm Action",primaryActionText:"Confirm",size:"sm"}},d={render:r=>e.jsx(o,{...r,children:e.jsx(t,{children:"This modal has custom text for the primary action button."})}),args:{title:"Delete Item",primaryActionText:"Delete Forever"}};var h,g,x;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <Text>This is the default modal content. It demonstrates the basic modal functionality.</Text>
    </ModalWrapper>,
  args: {
    title: 'Default Modal',
    primaryActionText: 'Save changes'
  }
}`,...(x=(g=a.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var f,y,T;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <Text>This modal doesn't have a primary action button, only the close button.</Text>
    </ModalWrapper>,
  args: {
    title: 'Information Modal',
    onPrimaryAction: undefined
  }
}`,...(T=(y=i.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var b,M,A;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <VStack align="stretch">
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Name
          </Text>
          <Input placeholder="Enter your name" />
        </div>
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Email
          </Text>
          <Input placeholder="Enter your email" type="email" />
        </div>
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Message
          </Text>
          <Input placeholder="Enter your message" />
        </div>
      </VStack>
    </ModalWrapper>,
  args: {
    title: 'Contact Form',
    primaryActionText: 'Submit'
  }
}`,...(A=(M=n.parameters)==null?void 0:M.docs)==null?void 0:A.source}}};var j,S,W;s.parameters={...s.parameters,docs:{...(j=s.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <Text>This modal shows the loading state of the primary action button.</Text>
    </ModalWrapper>,
  args: {
    title: 'Processing Request',
    primaryActionText: 'Processing...',
    isPrimaryActionLoading: true
  }
}`,...(W=(S=s.parameters)==null?void 0:S.docs)==null?void 0:W.source}}};var P,v,C;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <Text>The primary action button is disabled until certain conditions are met.</Text>
    </ModalWrapper>,
  args: {
    title: 'Confirmation Required',
    primaryActionText: 'Confirm',
    isPrimaryActionDisabled: true
  }
}`,...(C=(v=l.parameters)==null?void 0:v.docs)==null?void 0:C.source}}};var I,z,E;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <VStack align="stretch">
        <Text fontSize="lg" fontWeight="semibold">
          Large Modal Content
        </Text>
        <Text>
          This is a large modal that can accommodate more content. It's useful for complex forms, detailed information,
          or when you need more space to display data.
        </Text>
        <Text>
          You can add multiple sections, forms, tables, or any other components that require more screen real estate.
        </Text>
        <div>
          <Text mb={2} fontSize="sm" fontWeight="medium">
            Additional Form Field
          </Text>
          <Input placeholder="More form inputs can be added here" />
        </div>
      </VStack>
    </ModalWrapper>,
  args: {
    title: 'Large Modal Example',
    primaryActionText: 'Save All Changes',
    size: 'lg'
  }
}`,...(E=(z=m.parameters)==null?void 0:z.docs)==null?void 0:E.source}}};var D,F,L;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <Text>This is a smaller modal for simple confirmations or brief messages.</Text>
    </ModalWrapper>,
  args: {
    title: 'Confirm Action',
    primaryActionText: 'Confirm',
    size: 'sm'
  }
}`,...(L=(F=c.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var k,q,V;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: args => <ModalWrapper {...args}>
      <Text>This modal has custom text for the primary action button.</Text>
    </ModalWrapper>,
  args: {
    title: 'Delete Item',
    primaryActionText: 'Delete Forever'
  }
}`,...(V=(q=d.parameters)==null?void 0:q.docs)==null?void 0:V.source}}};const ne=["Default","WithoutPrimaryAction","WithForm","LoadingState","DisabledPrimaryAction","LargeModal","SmallModal","CustomPrimaryActionText"];export{d as CustomPrimaryActionText,a as Default,l as DisabledPrimaryAction,m as LargeModal,s as LoadingState,c as SmallModal,n as WithForm,i as WithoutPrimaryAction,ne as __namedExportsOrder,ie as default};
