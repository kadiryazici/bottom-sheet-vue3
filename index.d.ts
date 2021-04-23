import { PropType } from 'vue';
export declare const Sheet: import('vue').DefineComponent<
   {
      minHeight: {
         default: string;
         type: PropType<string>;
      };
      maxWidth: {
         default: string;
         type: PropType<string>;
      };
      maxHeight: {
         default: string;
         type: PropType<string>;
      };
      height: {
         default: string;
         type: PropType<string>;
      };
      slideIcon: {
         default: import('vue').VNode<
            import('vue').RendererNode,
            import('vue').RendererElement,
            {
               [key: string]: any;
            }
         >;
         type: null;
      };
      containerColor: {
         default: string;
         type: PropType<string>;
      };
      sheetColor: {
         default: string;
         type: PropType<string>;
      };
      sliderIconColor: {
         default: string;
         type: PropType<string>;
      };
      radius: {
         default: string;
         type: PropType<string>;
      };
      threshold: {
         type: PropType<number>;
         default: number;
      };
      clickOutside: {
         type: PropType<boolean>;
         default: boolean;
      };
      visible: {
         type: PropType<boolean>;
         required: true;
      };
   },
   () =>
      | import('vue').VNode<
           import('vue').RendererNode,
           import('vue').RendererElement,
           {
              [key: string]: any;
           }
        >
      | undefined,
   unknown,
   {},
   {},
   import('vue').ComponentOptionsMixin,
   import('vue').ComponentOptionsMixin,
   {
      'update:visible': (value: boolean) => true;
   },
   string,
   import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
   Readonly<
      {
         minHeight: string;
         maxWidth: string;
         maxHeight: string;
         height: string;
         slideIcon: any;
         containerColor: string;
         sheetColor: string;
         sliderIconColor: string;
         radius: string;
         threshold: number;
         clickOutside: boolean;
         visible: boolean;
      } & {}
   >,
   {
      minHeight: string;
      maxWidth: string;
      maxHeight: string;
      height: string;
      slideIcon: any;
      containerColor: string;
      sheetColor: string;
      sliderIconColor: string;
      radius: string;
      threshold: number;
      clickOutside: boolean;
   }
>;
