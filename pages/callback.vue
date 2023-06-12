<template>
    <div>
        Github callback page
    </div>
</template>
<script setup lang="ts">
const route = useRoute()
onMounted(()=>{
    const {
        code, state
    } = route.query
    console.log(code, state)
    const expectedState = localStorage.getItem("state")
    if (expectedState != state) {
        window.alert("state parameter does not match Github response. please try again")
        return
    }
    
    if (code) {
        localStorage.setItem("code", code.toString())
        window.close()
    }
    else {
        window.alert("empty code")
    }
})
</script>
