import { useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from "react"
import { useFrame } from "@react-three/fiber"
import { Group, MeshStandardMaterial, LoopOnce } from "three"
import { useAnimations, useGLTF, useScroll, useTexture } from "@react-three/drei"

const Model = forwardRef((props, ref) => {
   const group = useRef<Group>(null)
   const { nodes, materials, animations, scene } = useGLTF("/assets/animations/6_fig_yalla.glb")

   const { actions } = useAnimations(animations, scene)
   const [texture] = useTexture(["/assets/animations/textures/texture-2.webp"])
   const rotationAnim = actions["initaial rotation.001"]
   const ballOutAnimations = [
      { action: actions["ball.2_roll_out"], name: "ball.2_roll_out" },
      { action: actions["ball.3_roll_out.001"], name: "ball.3_roll_out.001" },
      { action: actions["ball.4_roll_out"], name: "ball.4_roll_out" },
   ]
   const ballAnimations = Array.from({ length: 25 }, (_, i) => actions[`ball_1st_anim_${i}`])

   // Expose startAnimation method to parent component
   useImperativeHandle(ref, () => ({
      startAnimation: () => {

         ballOutAnimations.forEach(({ action, name }) => {
            if (action) {
               action.reset().stop()
            }
         })

         if (rotationAnim) {
            rotationAnim.clampWhenFinished = true
            rotationAnim.setLoop(LoopOnce, 1)
            rotationAnim.reset().play()
            console.log("Animation 'initaial rotation.001' started")
         }

         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.clampWhenFinished = true
               ballAnim.setLoop(LoopOnce, 1)
               ballAnim.reset().play()
            }
         })
      }
   }))

   useEffect(() => {
      const material = materials[""] as MeshStandardMaterial | undefined

      if (material) {
         material.map = texture
         material.needsUpdate = true
      }

      return () => {
         if (rotationAnim) {
            rotationAnim.stop()
         }

         ballAnimations.forEach((ballAnim) => {
            if (ballAnim) {
               ballAnim.stop()
            }
         })

         ballOutAnimations.forEach(({ action, name }) => {
            if (action) {
               action.stop()
               console.log(`Animation '${name}' stopped`)
            }
         })
      }
   }, [actions, texture, materials])

   useFrame(() => {
      if (rotationAnim) {
         // Check if the animation is near the end of its duration
         if (rotationAnim.getClip().duration - rotationAnim.time < 0.01) {
            console.log("Animation 'initaial rotation.001' ended")
            rotationAnim.reset().stop()

            ballOutAnimations.forEach(({ action, name }) => {
               if (action) {
                  action.clampWhenFinished = true
                  action.setLoop(LoopOnce, 1)
                  action.reset().play()
                  console.log(`Animation '${name}' started`)
               }
            })
         }
      }
   })

   return (
      <group ref={group} position={[0, -5, 0]}>
         <primitive object={scene} />
      </group>
   )
})

export default Model
