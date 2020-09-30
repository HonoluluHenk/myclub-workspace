// export declare type NoInfer<T> = T & {
//   [K in keyof T]: T[K];
// };

export type NoInfer<T, R = T> = T extends never ? never : R;
