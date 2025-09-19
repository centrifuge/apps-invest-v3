import{j as e}from"./iframe-Bh4nsEqh.js";import{u as ne,a as ie,b as le,c as de,F as ce}from"./useGetFormError-B0Jma713.js";import{F as me,b as ue}from"./field-ONEhZa_b.js";import{C as pe,a as j,b as be,c as he}from"./checkbox-Cjx_oYM9.js";import{V as U}from"./v-stack-CfzajWK5.js";import{T as t}from"./text-B9-u84IE.js";import{B as g}from"./box-CLWAhm56.js";import"./index-Cun1SEai.js";import"./create-slot-recipe-context-DgHzcxly.js";import"./factory-C2D7TBAW.js";import"./icon-Czktae-r.js";import"./use-field-context-DpjkteSV.js";import"./create-split-props-BLHDZ2ef.js";import"./use-event-KVpjCCBj.js";import"./index-Bf1ftP2J.js";import"./index-BskpfAr_.js";function a(r){const{name:o,label:n,rules:i,disabled:X,onChange:k,labelStart:y=!0,...Z}=r,{control:$,trigger:ee}=ne(),{field:l,fieldState:{error:re},formState:ae}=ie({name:o,control:$,rules:i}),{isError:se,errorMessage:te}=le({error:re,name:o}),oe=ae.isSubmitting||X;return e.jsxs(me,{invalid:se,children:[e.jsxs(pe,{...Z,id:o,disabled:oe,checked:l.value,onBlur:()=>ee(o),onCheckedChange:C=>{l.onChange(C.checked),k==null||k(C.checked)},name:l.name,ref:l.ref,children:[y?e.jsx(j,{children:n}):null,e.jsx(be,{}),e.jsx(he,{}),y?null:e.jsx(j,{children:n})]}),e.jsx(ue,{children:te})]})}a.__docgenInfo={description:"",methods:[],displayName:"Checkbox",props:{name:{required:!0,tsType:{name:"FieldPath",elements:[{name:"TFieldValues"}],raw:"FieldPath<TFieldValues>"},description:""},label:{required:!1,tsType:{name:"union",raw:"string | React.ReactNode",elements:[{name:"string"},{name:"ReactReactNode",raw:"React.ReactNode"}]},description:""},rules:{required:!1,tsType:{name:"object"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(checked: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"checked"}],return:{name:"void"}}},description:""},labelStart:{required:!1,tsType:{name:"boolean"},description:""}},composes:["Omit"]};const De={title:"Forms/Components/Checkbox",component:a,parameters:{layout:"padded",docs:{description:{component:"A checkbox component integrated with react-hook-form with validation support."}}},argTypes:{disabled:{control:{type:"boolean"}},labelStart:{control:{type:"boolean"}},label:{control:{type:"text"}}},args:{onChange:r=>console.log("Checkbox changed:",r)}},s=({children:r,defaultValues:o={},showFormState:n=!0})=>{const i=de({defaultValues:o});return e.jsx(ce,{...i,children:e.jsx("form",{children:e.jsxs(U,{align:"stretch",children:[e.jsx(g,{maxWidth:"400px",background:"white",padding:"2rem",borderRadius:"10px",children:r}),n&&e.jsxs(g,{p:4,bg:"gray.200",borderRadius:"md",children:[e.jsx(t,{fontSize:"sm",color:"gray.600",fontWeight:"bold",mb:2,children:"Form State:"}),e.jsx(t,{fontSize:"xs",color:"gray.600",fontFamily:"mono",children:JSON.stringify(i.watch(),null,2)})]})]})})})},d={render:r=>e.jsx(s,{defaultValues:{agreement:!1},children:e.jsx(a,{...r})}),args:{name:"agreement",label:"I agree to the terms and conditions"}},c={render:r=>e.jsx(s,{defaultValues:{newsletter:!1},children:e.jsx(a,{...r})}),args:{name:"newsletter",label:"Subscribe to newsletter",labelStart:!1},parameters:{docs:{description:{story:"Checkbox with label positioned after the checkbox control."}}}},m={render:r=>e.jsx(s,{defaultValues:{notifications:!0},children:e.jsx(a,{...r})}),args:{name:"notifications",label:"Enable notifications"},parameters:{docs:{description:{story:"Checkbox that is checked by default."}}}},u={render:r=>e.jsx(s,{defaultValues:{readonly:!1},children:e.jsx(a,{...r})}),args:{name:"readonly",label:"This option is disabled",disabled:!0}},p={render:r=>e.jsx(s,{defaultValues:{readonlyChecked:!0},children:e.jsx(a,{...r})}),args:{name:"readonlyChecked",label:"This option is disabled and checked",disabled:!0},parameters:{docs:{description:{story:"Checkbox that is both disabled and checked."}}}},b={render:r=>e.jsx(s,{defaultValues:{required:!1},children:e.jsx(a,{...r})}),args:{name:"required",label:"You must accept this (required)",rules:{required:"This field is required"}},parameters:{docs:{description:{story:"Checkbox with required validation. Try submitting without checking."}}}},h={render:()=>e.jsx(s,{defaultValues:{feature1:!1,feature2:!0,feature3:!1},showFormState:!0,children:e.jsxs(U,{align:"stretch",children:[e.jsx(t,{fontWeight:"bold",fontSize:"md",mb:2,children:"Select features:"}),e.jsx(a,{name:"feature1",label:"Feature 1 - Basic functionality"}),e.jsx(a,{name:"feature2",label:"Feature 2 - Advanced options"}),e.jsx(a,{name:"feature3",label:"Feature 3 - Premium features",disabled:!0})]})}),args:{},parameters:{docs:{description:{story:"Multiple checkboxes in a form with different states."}}}},x={render:r=>e.jsx(s,{defaultValues:{complex:!1},children:e.jsx(a,{...r,label:e.jsxs(g,{children:[e.jsx(t,{fontWeight:"bold",children:"Terms and Conditions"}),e.jsxs(t,{fontSize:"sm",color:"fg.solid",mt:1,children:["I agree to the"," ",e.jsx(t,{as:"span",color:"blue.500",textDecoration:"underline",children:"terms of service"})," ","and"," ",e.jsx(t,{as:"span",color:"blue.500",textDecoration:"underline",children:"privacy policy"})]})]})})}),args:{name:"complex"},parameters:{docs:{description:{story:"Checkbox with a complex label containing multiple elements."}}}},f={render:r=>e.jsx(s,{defaultValues:{styled:!1},children:e.jsx(g,{p:4,bg:"blue.100",borderRadius:"lg",border:"1px solid",borderColor:"blue.200",children:e.jsx(a,{...r})})}),args:{name:"styled",label:"Checkbox in styled container"},parameters:{docs:{description:{story:"Checkbox within a custom styled container."}}}};var F,S,T;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    agreement: false
  }}>
      <Checkbox {...args} />
    </FormWrapper>,
  args: {
    name: 'agreement',
    label: 'I agree to the terms and conditions'
  }
}`,...(T=(S=d.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var w,W,V;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    newsletter: false
  }}>
      <Checkbox {...args} />
    </FormWrapper>,
  args: {
    name: 'newsletter',
    label: 'Subscribe to newsletter',
    labelStart: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with label positioned after the checkbox control.'
      }
    }
  }
}`,...(V=(W=c.parameters)==null?void 0:W.docs)==null?void 0:V.source}}};var q,v,R;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    notifications: true
  }}>
      <Checkbox {...args} />
    </FormWrapper>,
  args: {
    name: 'notifications',
    label: 'Enable notifications'
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox that is checked by default.'
      }
    }
  }
}`,...(R=(v=m.parameters)==null?void 0:v.docs)==null?void 0:R.source}}};var D,B,E;u.parameters={...u.parameters,docs:{...(D=u.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    readonly: false
  }}>
      <Checkbox {...args} />
    </FormWrapper>,
  args: {
    name: 'readonly',
    label: 'This option is disabled',
    disabled: true
  }
}`,...(E=(B=u.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var P,z,I;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    readonlyChecked: true
  }}>
      <Checkbox {...args} />
    </FormWrapper>,
  args: {
    name: 'readonlyChecked',
    label: 'This option is disabled and checked',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox that is both disabled and checked.'
      }
    }
  }
}`,...(I=(z=p.parameters)==null?void 0:z.docs)==null?void 0:I.source}}};var A,L,M;b.parameters={...b.parameters,docs:{...(A=b.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    required: false
  }}>
      <Checkbox {...args} />
    </FormWrapper>,
  args: {
    name: 'required',
    label: 'You must accept this (required)',
    rules: {
      required: 'This field is required'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with required validation. Try submitting without checking.'
      }
    }
  }
}`,...(M=(L=b.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var N,_,O;h.parameters={...h.parameters,docs:{...(N=h.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <FormWrapper defaultValues={{
    feature1: false,
    feature2: true,
    feature3: false
  }} showFormState={true}>
      <VStack align="stretch">
        <Text fontWeight="bold" fontSize="md" mb={2}>
          Select features:
        </Text>
        <Checkbox name="feature1" label="Feature 1 - Basic functionality" />
        <Checkbox name="feature2" label="Feature 2 - Advanced options" />
        <Checkbox name="feature3" label="Feature 3 - Premium features" disabled />
      </VStack>
    </FormWrapper>,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Multiple checkboxes in a form with different states.'
      }
    }
  }
}`,...(O=(_=h.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var Y,G,H;x.parameters={...x.parameters,docs:{...(Y=x.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    complex: false
  }}>
      <Checkbox {...args} label={<Box>
            <Text fontWeight="bold">Terms and Conditions</Text>
            <Text fontSize="sm" color="fg.solid" mt={1}>
              I agree to the{' '}
              <Text as="span" color="blue.500" textDecoration="underline">
                terms of service
              </Text>{' '}
              and{' '}
              <Text as="span" color="blue.500" textDecoration="underline">
                privacy policy
              </Text>
            </Text>
          </Box>} />
    </FormWrapper>,
  args: {
    name: 'complex'
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox with a complex label containing multiple elements.'
      }
    }
  }
}`,...(H=(G=x.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,Q;f.parameters={...f.parameters,docs:{...(J=f.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: args => <FormWrapper defaultValues={{
    styled: false
  }}>
      <Box p={4} bg="blue.100" borderRadius="lg" border="1px solid" borderColor="blue.200">
        <Checkbox {...args} />
      </Box>
    </FormWrapper>,
  args: {
    name: 'styled',
    label: 'Checkbox in styled container'
  },
  parameters: {
    docs: {
      description: {
        story: 'Checkbox within a custom styled container.'
      }
    }
  }
}`,...(Q=(K=f.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};const Be=["Default","LabelAtEnd","PreChecked","Disabled","DisabledChecked","WithValidation","MultipleCheckboxes","ComplexLabel","CustomStyling"];export{x as ComplexLabel,f as CustomStyling,d as Default,u as Disabled,p as DisabledChecked,c as LabelAtEnd,h as MultipleCheckboxes,m as PreChecked,b as WithValidation,Be as __namedExportsOrder,De as default};
