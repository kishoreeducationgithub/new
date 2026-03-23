export function ToddlerAvatar({ avatar, pose }) {
  const roleClass = avatar.id === 'lead' ? 'scene-child--lead' : `scene-child--${avatar.depth}`

  return (
    <div
      className={`scene-child ${roleClass} scene-child--pose-${pose}`}
      style={{
        '--avatar-bottom': avatar.bottom,
        '--delay': avatar.delay,
        '--offset-x': avatar.offsetX,
        '--offset-x-mobile': avatar.offsetXMobile,
        '--scale': avatar.scale,
      }}
    >
      <div className="scene-child__shadow" />
      <div
        className="scene-child__figure"
        style={{
          '--dress-tone': avatar.dressTone,
          '--skin-tone': avatar.skinTone,
          '--hair-tone': avatar.hairTone,
          '--accent-tone': avatar.accentTone,
          '--shoe-tone': avatar.shoeTone,
        }}
      >
        <div className="scene-child__head">
          <span className="scene-child__hair-back" />
          <span className="scene-child__ponytail" />
          <span className="scene-child__bow" />
          <span className="scene-child__hair-bangs" />
          <span className="scene-child__eye scene-child__eye--left" />
          <span className="scene-child__eye scene-child__eye--right" />
          <span className="scene-child__blush scene-child__blush--left" />
          <span className="scene-child__blush scene-child__blush--right" />
          <span className="scene-child__nose" />
          <span className="scene-child__smile" />
        </div>
        <div className="scene-child__arm scene-child__arm--left" />
        <div className="scene-child__arm scene-child__arm--right" />
        <div className="scene-child__torso">
          <span className="scene-child__badge" />
        </div>
        <div className="scene-child__leg scene-child__leg--left" />
        <div className="scene-child__leg scene-child__leg--right" />
      </div>
    </div>
  )
}
