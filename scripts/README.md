## Build instructions

run this to build the linux binary:

```
cargo build --release && cargo build --release --target x86_64-unknown-linux-musl && mv target/release/scripts build_script_arm && mv target/x86_64-unknown-linux-musl/release/scripts build_script_x86_linux
```

this also copies the binaries out of `target` dir into the main directory of `scripts`, named as:
build_script_x86_linux for cloudflare build
build_script_arm for running on mac

---

## Setup prerequisites

1. Add the Rust standard lib for the target platform:

```
rustup target add x86_64-unknown-linux-musl
```

2. You'll need the linker installed, you can get it through homebrew (this download is from a community contribution):

```
brew install filosottile/musl-cross/musl-cross
```

3. Tell Rust about the linker in a `.cargo/config` file for system wide (or just rely on the config in this repo)

```
[target.x86_64-unknown-linux-musl]
linker = "x86_64-linux-musl-gcc"
```

4. Important to make sure the homebrew bin is in your path (/opt/homebrew/bin for ARM Mac)

5. Try the build command above and cross those fingers!
