import { AppState } from './state'

import * as React from 'react'
import {
  connect as reduxConnect,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
  MergeProps,
  Options
} from 'react-redux'

export type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> = <
  TComponent extends React.ComponentType<TInjectedProps & TNeedsProps>
>(
  component: TComponent
) => TComponent

interface Connect {
  <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}>(
    mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, AppState>,
    mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>
  ): InferableComponentEnhancerWithProps<
    TStateProps & TDispatchProps,
    TOwnProps
  >

  <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}, TMergedProps = {}>(
    mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, AppState>,
    mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
    mergeProps?: MergeProps<
      TStateProps,
      TDispatchProps,
      TOwnProps,
      TMergedProps
    >,
    options?: Options<TStateProps, TOwnProps, TMergedProps>
  ): InferableComponentEnhancerWithProps<TMergedProps, TOwnProps>
}

export const connect = reduxConnect as Connect
