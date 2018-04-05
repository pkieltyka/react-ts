import * as React from 'react'
import { connect } from './connect'

interface Props {
  name: string
}

interface StateProps {
  player: string
}

@connect<StateProps, {}, Props>(state => ({
  player: state.player
}))
export class Hello extends React.Component<StateProps & Props, {}> {
  render() {
    const { player } = this.props
    const { name } = this.props
    return (
      <h1>
        Hello @{name} and {player}
      </h1>
    )
  }
}
