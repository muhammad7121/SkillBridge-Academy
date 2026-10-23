import { ExamQuestion } from '../types/exam';

export const QUESTION_BANK: ExamQuestion[] = [
  // ----------------------------------------------------
  // WEEK 1: IT Fundamentals, Hardware, Cabling & Troubleshooting (12 Questions)
  // ----------------------------------------------------
  {
    id: "W1-Q01",
    week: 1,
    topic: "Device roles",
    question: "Which network device connects a home or office network to the Internet and directs traffic using IP addresses?",
    options: {
      A: "Managed switch",
      B: "Access point",
      C: "Router",
      D: "Workstation"
    },
    correct: "C",
    explanation: "Routers connect separate networks (like a local LAN to the Internet) and make forwarding decisions using IP addresses. Switches connect devices inside the same LAN using MAC addresses."
  },
  {
    id: "W1-Q02",
    week: 1,
    topic: "Device roles",
    question: "What is the main job of a network switch inside an office LAN?",
    options: {
      A: "Assign public internet IP addresses to clients",
      B: "Connect local devices and forward data to the correct port using MAC addresses",
      C: "Host the company website and email",
      D: "Provide power to all room lights"
    },
    correct: "B",
    explanation: "A switch learns the MAC addresses of connected devices and sends network frames only to the port where the destination device is plugged in."
  },
  {
    id: "W1-Q03",
    week: 1,
    topic: "Hardware",
    question: "A computer becomes very slow when opening several programs at once, and the disk drive light stays on constantly. What hardware resource is running low?",
    options: {
      A: "Monitor screen size",
      B: "RAM (Working memory)",
      C: "Keyboard buffer",
      D: "Audio speakers"
    },
    correct: "B",
    explanation: "When a computer runs out of physical RAM, it moves data between memory and the hard drive (paging/virtual memory), causing the drive to work continuously and the system to slow down."
  },
  {
    id: "W1-Q04",
    week: 1,
    topic: "Cabling",
    question: "What is the standard maximum recommended length for a copper Ethernet network cable run (including patch cords)?",
    options: {
      A: "10 meters",
      B: "50 meters",
      C: "100 meters",
      D: "500 meters"
    },
    correct: "C",
    explanation: "Standard copper twisted-pair Ethernet cables (Cat5e, Cat6) have a maximum certified channel length of 100 meters (approx. 328 feet)."
  },
  {
    id: "W1-Q05",
    week: 1,
    topic: "Asset register",
    question: "Which details are most important to record when adding a new computer to a company IT asset register?",
    options: {
      A: "Asset ID, make/model, serial number, role, location, and status",
      B: "Only the color of the computer case",
      C: "The user's favorite website",
      D: "Only the price of the power cable"
    },
    correct: "A",
    explanation: "A proper IT asset register tracks identity (Asset ID and serial number), hardware details (make/model), location, assigned role, and whether it is active or in repair."
  },
  {
    id: "W1-Q06",
    week: 1,
    topic: "Support tickets",
    question: "When a user contacts the IT helpdesk with a computer issue, what should you record first in the ticket?",
    options: {
      A: "Your personal opinion of the user",
      B: "The exact problem and symptoms in the user's words, followed by technical notes",
      C: "A random command without checking the problem",
      D: "The list of games installed on the computer"
    },
    correct: "B",
    explanation: "Good IT support starts by capturing what the user is experiencing, then structuring it into clear technical facts for investigation and handover."
  },
  {
    id: "W1-Q07",
    week: 1,
    topic: "Troubleshooting",
    question: "If a computer suddenly loses network access, what should you check first before changing any server settings?",
    options: {
      A: "Reinstall the entire Windows operating system",
      B: "Check physical things first: cable plugged in tightly, port link lights on, and power",
      C: "Delete all user accounts on the domain controller",
      D: "Change the desktop background picture"
    },
    correct: "B",
    explanation: "Always troubleshoot from the physical layer first. Most sudden connection drops are caused by loose cables, faulty wall ports, or powered-off equipment."
  },
  {
    id: "W1-Q08",
    week: 1,
    topic: "Lab safety",
    question: "What is the correct safety practice when working in the SkillBridge networking lab?",
    options: {
      A: "Run network security scans against random public websites",
      B: "Use only authorized academy equipment, assigned accounts, and isolated lab networks",
      C: "Share one administrator password among all students in class",
      D: "Bridge experimental lab virtual machines onto the live campus production network"
    },
    correct: "B",
    explanation: "Lab experiments must always stay on authorized, isolated networks so they do not disrupt live school or company systems."
  },
  {
    id: "W1-Q09",
    week: 1,
    topic: "Device roles",
    question: "What is the primary job of a Wireless Access Point (WAP) in a lab or office?",
    options: {
      A: "To connect wireless devices (phones, laptops) onto the wired network",
      B: "To replace computer hard drives",
      C: "To provide electrical power to computers",
      D: "To assign public internet domain names"
    },
    correct: "A",
    explanation: "A Wireless Access Point bridges wireless Wi-Fi signals to the wired Ethernet infrastructure so wireless devices can communicate with the local network."
  },
  {
    id: "W1-Q10",
    week: 1,
    topic: "Cabling",
    question: "A network cable tester shows that an Ethernet patch lead has broken or mismatched wires. What should you do?",
    options: {
      A: "Put it back in the clean cable bin for someone else to use",
      B: "Label it as faulty, take it out of service, and record it in inventory",
      C: "Use it on the main domain controller server",
      D: "Ignore the tester result"
    },
    correct: "B",
    explanation: "Defective cables must be quarantined and labeled so they are never accidentally used in a live setup, preventing hard-to-find network problems."
  },
  {
    id: "W1-Q11",
    week: 1,
    topic: "Troubleshooting method",
    question: "Why should an IT technician change only one setting at a time when troubleshooting a computer problem?",
    options: {
      A: "Because computers only permit one setting change per day",
      B: "So you know exactly which change solved or caused the problem",
      C: "To make your work day last longer",
      D: "It is only required when troubleshooting Wi-Fi"
    },
    correct: "B",
    explanation: "Changing multiple settings at the same time makes it impossible to know which action actually resolved the issue, and can introduce new hidden problems."
  },
  {
    id: "W1-Q12",
    week: 1,
    topic: "Hardware",
    question: "What does an active green link light on a computer's Ethernet network port indicate?",
    options: {
      A: "The user has domain administrator rights",
      B: "A good physical and electrical connection exists to the switch or router",
      C: "Windows has finished installing all software updates",
      D: "The computer has no viruses"
    },
    correct: "B",
    explanation: "The network port link light confirms that the physical layer (Layer 1) connection is working properly between the network card and the connected switch."
  },

  // ----------------------------------------------------
  // WEEK 2: Windows 11 Build, Local Accounts & Least Privilege (12 Questions)
  // ----------------------------------------------------
  {
    id: "W2-Q01",
    week: 2,
    topic: "Windows deployment",
    question: "Why is a clean installation of Windows 11 preferred when building a standardized lab computer?",
    options: {
      A: "It permanently disables all networking",
      B: "It starts from a clean, predictable baseline without leftover files or malware from previous setups",
      C: "It removes the need to ever set a password",
      D: "It makes the computer screen twice as bright"
    },
    correct: "B",
    explanation: "Clean installs provide a documented, clean baseline that ensures predictable behavior and simplifies testing."
  },
  {
    id: "W2-Q02",
    week: 2,
    topic: "Least privilege",
    question: "What does the 'Principle of Least Privilege' mean for standard daily user accounts?",
    options: {
      A: "Every standard user should be made a Domain Administrator",
      B: "Users receive only the minimum permissions needed to do their everyday work, not full administrator rights",
      C: "Users are never allowed to log in to their computer",
      D: "All staff in the company share the same administrator password"
    },
    correct: "B",
    explanation: "Least privilege limits potential damage from mistakes and malware by ensuring routine users do not have administrative privileges."
  },
  {
    id: "W2-Q03",
    week: 2,
    topic: "Local administration",
    question: "Which information belongs in a professional Windows 11 workstation build record?",
    options: {
      A: "Computer name (hostname), updates installed, local accounts created, and verification test results",
      B: "Only the wallpaper picture chosen",
      C: "The color of the computer desk",
      D: "Only the brand of coffee on the desk"
    },
    correct: "A",
    explanation: "A build record documents how a machine was configured and proves that it passed all quality and security tests before being handed over to users."
  },
  {
    id: "W2-Q04",
    week: 2,
    topic: "Shares",
    question: "When setting up a controlled shared folder on Windows, what is the most important check to perform?",
    options: {
      A: "Verify that anyone on the Internet can delete all files",
      B: "Verify that authorized users can access it and unauthorized users are properly blocked",
      C: "Verify that the folder has no name",
      D: "Turn off the computer immediately"
    },
    correct: "B",
    explanation: "Testing both authorized access and unauthorized denial verifies that least-privilege folder permissions work as intended."
  },
  {
    id: "W2-Q05",
    week: 2,
    topic: "BIOS/UEFI",
    question: "Why must hardware virtualization support (Intel VT-x or AMD-V) be enabled in BIOS/UEFI?",
    options: {
      A: "To allow hypervisors like VirtualBox to run virtual machines smoothly and efficiently",
      B: "To download web pages without a network connection",
      C: "To turn on the computer keyboard lights",
      D: "To automatically activate Windows licenses"
    },
    correct: "A",
    explanation: "Virtualization extensions in the CPU are required for modern hypervisors (VirtualBox, VMware, Hyper-V) to run 64-bit guest virtual machines."
  },
  {
    id: "W2-Q06",
    week: 2,
    topic: "Windows 11 editions",
    question: "Why must the lab client run Windows 11 Pro (or Enterprise) rather than Windows 11 Home when joining an Active Directory domain?",
    options: {
      A: "Windows 11 Home edition cannot join an Active Directory domain",
      B: "Windows 11 Pro uses less memory than Home",
      C: "Windows 11 Home cannot connect to an Ethernet cable",
      D: "Windows 11 Pro disables all user accounts"
    },
    correct: "A",
    explanation: "Joining an Active Directory domain is a business feature available in Windows Pro, Enterprise, and Education editions, but not in Home edition."
  },
  {
    id: "W2-Q07",
    week: 2,
    topic: "Recovery",
    question: "Why is taking a snapshot in VirtualBox helpful before testing a major system change?",
    options: {
      A: "You can easily roll back to a working state in minutes if the change breaks something",
      B: "It permanently deletes all virtual machine files",
      C: "It replaces the need for Active Directory",
      D: "It permanently doubles the host computer RAM"
    },
    correct: "A",
    explanation: "Snapshots save the virtual machine's current state so you can quickly restore it if an experiment fails, saving hours of rebuilding."
  },
  {
    id: "W2-Q08",
    week: 2,
    topic: "Updates",
    question: "Why is installing Windows updates right after a clean install important?",
    options: {
      A: "It patches security vulnerabilities and fixes known system bugs before putting the machine into service",
      B: "It removes the computer name",
      C: "It automatically creates domain administrator accounts",
      D: "It permanently disables the network adapter"
    },
    correct: "A",
    explanation: "Applying security updates is an essential baseline step to harden any operating system before configuring services and user accounts."
  },
  {
    id: "W2-Q09",
    week: 2,
    topic: "Hostname",
    question: "Why should every computer on a network have a unique, documented hostname (computer name)?",
    options: {
      A: "So IT inventory, support tickets, and network servers can identify each computer without confusion",
      B: "Because Windows allows only one computer name in the entire world",
      C: "Computer names replace the need for IP addresses completely",
      D: "Computer names are only used to choose the desktop background"
    },
    correct: "A",
    explanation: "Unique hostnames allow administrators, DHCP servers, and Active Directory to clearly recognize and manage each physical or virtual machine."
  },
  {
    id: "W2-Q10",
    week: 2,
    topic: "Local vs domain",
    question: "What is the key difference between a local user account and an Active Directory domain account?",
    options: {
      A: "A local account is authenticated only on that specific computer; a domain account is authenticated centrally by the Domain Controller",
      B: "Local accounts only work on Linux servers",
      C: "Domain accounts cannot open File Explorer",
      D: "Local accounts always have full Domain Admin rights"
    },
    correct: "A",
    explanation: "Local accounts exist in the individual machine's SAM database, whereas domain accounts are stored centrally on the Domain Controller and can sign into any authorized domain computer."
  },
  {
    id: "W2-Q11",
    week: 2,
    topic: "Documentation",
    question: "What is the best evidence to prove you successfully set up a Windows 11 lab workstation?",
    options: {
      A: "A completed build record with hostname, network configuration, and verified access test screenshots",
      B: "An internet meme about computers",
      C: "Only the VirtualBox software version number",
      D: "A photo of the power plug on the wall"
    },
    correct: "A",
    explanation: "A proper IT portfolio submission includes clear documentation of the machine's configuration and screenshots showing working access tests."
  },
  {
    id: "W2-Q12",
    week: 2,
    topic: "Installation media",
    question: "What is the utility tool Rufus commonly used for in IT labs?",
    options: {
      A: "Creating a bootable USB installation drive from an ISO file",
      B: "Promoting a Windows server to a Domain Controller",
      C: "Configuring network settings on Ubuntu Linux",
      D: "Editing video files for presentations"
    },
    correct: "A",
    explanation: "Rufus is a widely used free tool that writes operating system ISO images onto USB flash drives so they can boot on bare-metal or virtual hardware."
  },

  // ----------------------------------------------------
  // WEEK 3: VirtualBox, Active Directory, DNS, DHCP & Domain Join (18 Questions)
  // ----------------------------------------------------
  {
    id: "W3-Q01",
    week: 3,
    topic: "Lab network",
    question: "In the SkillBridge lab, how is the VirtualBox Host-Only network configured for the virtual machines?",
    options: {
      A: "10.0.2.0/24 with VirtualBox DHCP enabled",
      B: "192.168.10.0/24 with VirtualBox DHCP disabled",
      C: "172.16.0.0/12 bridged directly to the campus Wi-Fi",
      D: "Public internet with no firewall"
    },
    correct: "B",
    explanation: "The lab uses the isolated network 192.168.10.0/24 with VirtualBox's internal DHCP turned off, allowing our Windows Server DC01 to act as the sole DHCP server."
  },
  {
    id: "W3-Q02",
    week: 3,
    topic: "DC01 addressing",
    question: "What static IP address is assigned to the Domain Controller (DC01) in the standard lab design?",
    options: {
      A: "192.168.10.1",
      B: "192.168.10.10",
      C: "192.168.10.20",
      D: "192.168.10.100"
    },
    correct: "B",
    explanation: "In the lab design, DC01 is assigned 192.168.10.10; .1 is the host-only adapter gateway, .20 is Ubuntu lnx01, and .100+ is the DHCP pool."
  },
  {
    id: "W3-Q03",
    week: 3,
    topic: "Active Directory",
    question: "What is the primary role of an Active Directory Domain Controller (AD DS)?",
    options: {
      A: "To host public gaming servers",
      B: "To centrally store directory information and authenticate users and computers across the domain",
      C: "To replace all physical Ethernet cables in the building",
      D: "To assign public IP addresses on the Internet"
    },
    correct: "B",
    explanation: "Active Directory Domain Services (AD DS) provides centralized identity, user logon authentication, and policy management for all computers joined to the domain."
  },
  {
    id: "W3-Q04",
    week: 3,
    topic: "DNS",
    question: "Why must a Windows client point to DC01 (192.168.10.10) as its DNS server before trying to join 'skillbridge.local'?",
    options: {
      A: "Because only DC01 has the local Active Directory SRV records needed to locate the domain controller",
      B: "Because Windows 11 cannot connect to any other DNS server",
      C: "Because Google DNS is blocked by Windows",
      D: "Because DNS is only used for downloading music"
    },
    correct: "A",
    explanation: "Active Directory depends heavily on DNS SRV records to discover domain services. Public DNS servers do not know anything about private '.local' domains."
  },
  {
    id: "W3-Q05",
    week: 3,
    topic: "DHCP",
    question: "If a lab client computer receives an IP address starting with 169.254.x.x (APIPA), what does it mean?",
    options: {
      A: "The client successfully joined the domain",
      B: "The client failed to contact a DHCP server and could not obtain an IP address lease",
      C: "The client is connected directly to the Internet",
      D: "DNS is working perfectly"
    },
    correct: "B",
    explanation: "An APIPA address (169.254.x.x) is automatically assigned by Windows when it asks for an IP address via DHCP but receives no response from any DHCP server."
  },
  {
    id: "W3-Q06",
    week: 3,
    topic: "DHCP design",
    question: "Why must VirtualBox's built-in DHCP server be turned OFF on the Host-Only network adapter in this lab?",
    options: {
      A: "VirtualBox cannot run two virtual machines at the same time otherwise",
      B: "To prevent two DHCP servers from clashing and handing out conflicting IP addresses",
      C: "Because DHCP is never used in enterprise networks",
      D: "To turn off the computer monitor"
    },
    correct: "B",
    explanation: "Having two DHCP servers on the same network creates conflicts. Disabling VirtualBox DHCP ensures that DC01 is the only server assigning IP leases."
  },
  {
    id: "W3-Q07",
    week: 3,
    topic: "OUs and groups",
    question: "What is an Organizational Unit (OU) used for in Active Directory?",
    options: {
      A: "A container used to organize users, computers, and groups, and to apply Group Policies",
      B: "A type of physical network cable",
      C: "A VirtualBox snapshot file",
      D: "A public DNS root server"
    },
    correct: "A",
    explanation: "OUs are logical containers in Active Directory that help organize accounts by department or location and allow administrators to link Group Policy Objects (GPOs)."
  },
  {
    id: "W3-Q08",
    week: 3,
    topic: "Least privilege",
    question: "Why should everyday office staff NOT be added to the Domain Admins group?",
    options: {
      A: "Domain Admins cannot log into desktop computers",
      B: "If an admin account is compromised by malware or a mistake occurs, it can affect the entire corporate domain",
      C: "Domain Admins are blocked from opening shared folders",
      D: "Windows automatically deletes administrator accounts after one hour"
    },
    correct: "B",
    explanation: "High-privilege accounts have the power to change or delete anything in the domain. Keeping daily user accounts separate reduces security risks."
  },
  {
    id: "W3-Q09",
    week: 3,
    topic: "Domain join",
    question: "After successfully joining the domain, how should a user sign in on WIN11-CLIENT01?",
    options: {
      A: "With a local account that does not exist",
      B: "Using their domain account format: SKILLBRIDGE\\username or username@skillbridge.local",
      C: "Using only the computer's serial number",
      D: "Without entering any password"
    },
    correct: "B",
    explanation: "Domain logins authenticate against Active Directory using either the NetBIOS format (DOMAIN\\user) or the User Principal Name format (user@domain.local)."
  },
  {
    id: "W3-Q10",
    week: 3,
    topic: "File share",
    question: "A user can open the shared folder \\\\DC01\\LabShare but cannot create or edit any files inside it. What should you check?",
    options: {
      A: "Only the desktop wallpaper",
      B: "Both Share permissions and NTFS permissions (the more restrictive permission wins)",
      C: "Whether the computer monitor is turned on",
      D: "The BIOS clock format"
    },
    correct: "B",
    explanation: "Effective file access is determined by combining Share permissions and NTFS permissions. Whichever is more restrictive will apply to the user."
  },
  {
    id: "W3-Q11",
    week: 3,
    topic: "NAT vs Host-Only",
    question: "In the DC01 virtual machine, Adapter 1 is set to NAT and Adapter 2 is set to Host-Only. What is the purpose of NAT?",
    options: {
      A: "To allow DC01 to reach the Internet for downloads and updates while keeping the lab LAN private",
      B: "To give the client computer a public internet address",
      C: "To disable Active Directory",
      D: "To replace DNS entirely"
    },
    correct: "A",
    explanation: "NAT allows the virtual machine to download software and updates from the Internet through your host computer without exposing the private lab network."
  },
  {
    id: "W3-Q12",
    week: 3,
    topic: "Snapshots",
    question: "Why should you take VirtualBox snapshots at important milestones during the lab?",
    options: {
      A: "Snapshots remove the need to take notes",
      B: "If an error happens, you can roll back in minutes rather than spending hours rebuilding from scratch",
      C: "Snapshots automatically join the domain for you",
      D: "Snapshots double the physical RAM of your laptop"
    },
    correct: "B",
    explanation: "Snapshots act as save points in a virtual lab, allowing quick recovery if an experimental configuration causes a system failure."
  },
  {
    id: "W3-Q13",
    week: 3,
    topic: "Troubleshooting",
    question: "If 'ping 192.168.10.10' works from the Windows client, but 'nslookup skillbridge.local' fails, what is the most likely problem?",
    options: {
      A: "The client's DNS settings are wrong (not pointing to 192.168.10.10) or the DNS service is stopped on DC01",
      B: "The client monitor brightness is too low",
      C: "The color of the Ethernet cable is wrong",
      D: "The keyboard is set to the wrong language"
    },
    correct: "A",
    explanation: "Since IP pinging works, the network connection is fine. A failure to resolve domain names means DNS is misconfigured on the client or stopped on the server."
  },
  {
    id: "W3-Q14",
    week: 3,
    topic: "DHCP scope",
    question: "What DHCP address range is configured on DC01 to automatically give IP addresses to lab clients?",
    options: {
      A: "192.168.10.1 to 192.168.10.10",
      B: "192.168.10.100 to 192.168.10.200",
      C: "10.0.2.15 to 10.0.2.20",
      D: "8.8.8.8 to 8.8.4.4"
    },
    correct: "B",
    explanation: "Low IP addresses (.1 to .99) are kept free for servers and static devices; client computers dynamically lease addresses between .100 and .200."
  },
  {
    id: "W3-Q15",
    week: 3,
    topic: "Domain name",
    question: "What is the exact Active Directory domain name used throughout the SkillBridge lab manual?",
    options: {
      A: "skillbridge.local",
      B: "google.com",
      C: "localhost.lan",
      D: "windows.microsoft"
    },
    correct: "A",
    explanation: "The lab manual specifies 'skillbridge.local' as the internal Active Directory domain name."
  },
  {
    id: "W3-Q16",
    week: 3,
    topic: "Multi-homed DC",
    question: "If running 'nslookup DC01' returns an unwanted NAT IP (like 10.0.2.15) instead of 192.168.10.10, what caused this?",
    options: {
      A: "The DC automatically registered its secondary NAT network adapter IP in DNS",
      B: "The client computer has no keyboard plugged in",
      C: "VirtualBox snapshots are turned off",
      D: "The domain name is too short"
    },
    correct: "A",
    explanation: "When a server has multiple network adapters, Windows DNS may register all IP addresses. Administrators should disable DNS registration on the external NAT adapter."
  },
  {
    id: "W3-Q17",
    week: 3,
    topic: "Verification",
    question: "Which Windows command line tool shows your computer's full IP address, subnet mask, default gateway, and DNS servers?",
    options: {
      A: "ipconfig /all",
      B: "dir C:\\",
      C: "chkdsk",
      D: "notepad"
    },
    correct: "A",
    explanation: "Running 'ipconfig /all' displays comprehensive TCP/IP network details for all adapters on a Windows computer."
  },
  {
    id: "W3-Q18",
    week: 3,
    topic: "Identity",
    question: "Which Windows command displays the currently logged-on user account in DOMAIN\\user format?",
    options: {
      A: "whoami",
      B: "ping",
      C: "tracert",
      D: "mspaint"
    },
    correct: "A",
    explanation: "The 'whoami' command immediately outputs the domain and username of the current user session."
  },

  // ----------------------------------------------------
  // WEEK 4: Ubuntu Server, SSH, Netplan, Nginx & Hardening (18 Questions)
  // ----------------------------------------------------
  {
    id: "W4-Q01",
    week: 4,
    topic: "Linux lab addressing",
    question: "In the Week 4 Linux lab, what is the standard static IP address for the Ubuntu server (lnx01)?",
    options: {
      A: "192.168.10.10",
      B: "192.168.10.20",
      C: "192.168.10.1",
      D: "192.168.10.100"
    },
    correct: "B",
    explanation: "The Ubuntu server lnx01 is assigned 192.168.10.20 on the lab network (while DC01 is 192.168.10.10)."
  },
  {
    id: "W4-Q02",
    week: 4,
    topic: "Netplan",
    question: "On modern Ubuntu Server, which tool and file format is used to configure permanent network settings?",
    options: {
      A: "Netplan using YAML configuration files",
      B: "Active Directory Users and Computers",
      C: "Windows DHCP console only",
      D: "Microsoft Paint"
    },
    correct: "A",
    explanation: "Ubuntu uses Netplan to define network configuration in simple YAML files located in /etc/netplan/."
  },
  {
    id: "W4-Q03",
    week: 4,
    topic: "SSH",
    question: "Why is SSH key-based authentication preferred over simple passwords for administering a Linux server?",
    options: {
      A: "It eliminates the need for any firewall",
      B: "It is much stronger against brute-force password guessing attacks and supports secure automation",
      C: "It turns off all server activity logs",
      D: "It only works on Windows computers"
    },
    correct: "B",
    explanation: "Cryptographic SSH keys are virtually impossible to guess with password attacks and provide secure, reliable remote access."
  },
  {
    id: "W4-Q04",
    week: 4,
    topic: "PuTTY",
    question: "What is the PuTTY application on Windows primarily used for in this lab?",
    options: {
      A: "To edit the Windows Registry of DC01",
      B: "To open a secure SSH command-line terminal to the Ubuntu Linux server",
      C: "To replace VirtualBox completely",
      D: "To create Active Directory forests"
    },
    correct: "B",
    explanation: "PuTTY is an SSH client that allows administrators on Windows to remotely access and control a Linux server via command-line."
  },
  {
    id: "W4-Q05",
    week: 4,
    topic: "Packages",
    question: "Which command updates the package list and installs all available software upgrades on Ubuntu?",
    options: {
      A: "sudo apt update && sudo apt upgrade",
      B: "ipconfig /renew",
      C: "Get-WindowsUpdate",
      D: "chkdsk /f"
    },
    correct: "A",
    explanation: "'apt update' refreshes the list of available software packages, and 'apt upgrade' installs the latest versions of installed packages."
  },
  {
    id: "W4-Q06",
    week: 4,
    topic: "Users and sudo",
    question: "Why should an administrator use 'sudo' for admin tasks instead of logging in directly as the 'root' superuser?",
    options: {
      A: "To enforce least privilege and keep an audit log of who performed administrative actions",
      B: "To prevent the user from ever installing packages",
      C: "To disable the SSH server",
      D: "To force the use of unencrypted Telnet"
    },
    correct: "A",
    explanation: "Using sudo allows regular accounts to temporarily elevate permissions only when needed, logging every administrative command for security and accountability."
  },
  {
    id: "W4-Q07",
    week: 4,
    topic: "Permissions",
    question: "In Linux file permissions, what does the execute (x) permission on a directory allow you to do?",
    options: {
      A: "Enter and navigate into the directory (such as with the 'cd' command)",
      B: "Only change the system clock",
      C: "Join an Active Directory domain",
      D: "Disable the network card"
    },
    correct: "A",
    explanation: "On Linux directories, the execute permission allows a user to access, traverse, and 'cd' into that directory."
  },
  {
    id: "W4-Q08",
    week: 4,
    topic: "nginx",
    question: "After installing Nginx web server on lnx01, how do you verify it works from the Windows client?",
    options: {
      A: "Open a web browser on the client and navigate to http://192.168.10.20/",
      B: "Open Active Directory Sites and Services",
      C: "Run 'chkdsk' on the C: drive",
      D: "Disable the network adapter"
    },
    correct: "A",
    explanation: "Web servers respond on HTTP (port 80). Visiting the server's IP in a browser confirms that the service is running and accessible over the network."
  },
  {
    id: "W4-Q09",
    week: 4,
    topic: "UFW",
    question: "What is a good firewall (UFW) policy for a lab server that should only be accessed from the lab network?",
    options: {
      A: "Allow traffic from the entire Internet with zero restrictions",
      B: "Allow SSH and HTTP only from the lab network (192.168.10.0/24), and block other incoming traffic",
      C: "Turn off the firewall and disconnect the network cable",
      D: "Block SSH permanently so nobody can ever log in"
    },
    correct: "B",
    explanation: "Firewalls should follow least privilege: permit only required services (SSH, HTTP) from trusted network ranges, blocking everything else."
  },
  {
    id: "W4-Q10",
    week: 4,
    topic: "Storage",
    question: "After partitioning and formatting a new virtual hard disk on Ubuntu, why do we add an entry to '/etc/fstab'?",
    options: {
      A: "To automatically mount the disk partition every time the server boots up",
      B: "To join the Windows domain",
      C: "To disable the SSH server",
      D: "To change the computer wallpaper"
    },
    correct: "A",
    explanation: "The '/etc/fstab' file lists filesystem partitions and mount points that the Linux operating system mounts automatically on boot."
  },
  {
    id: "W4-Q11",
    week: 4,
    topic: "cron",
    question: "What is the 'cron' tool commonly used for on a Linux server?",
    options: {
      A: "Scheduling automated recurring tasks, such as running a daily backup script",
      B: "Replacing the computer processor",
      C: "Drawing network diagram charts",
      D: "Changing the monitor brightness"
    },
    correct: "A",
    explanation: "Cron is the Linux time-based job scheduler used to run maintenance tasks, scripts, and backups automatically at specified intervals."
  },
  {
    id: "W4-Q12",
    week: 4,
    topic: "Snapshots",
    question: "Before making a risky configuration change on your Linux VM, what is the best VirtualBox practice?",
    options: {
      A: "Delete the virtual machine completely",
      B: "Take a snapshot so you can quickly restore if the change breaks the system",
      C: "Disable the firewall forever",
      D: "Unplug the classroom network switch"
    },
    correct: "B",
    explanation: "Taking a snapshot provides a fast, reliable recovery point before making experimental system adjustments."
  },
  {
    id: "W4-Q13",
    week: 4,
    topic: "Troubleshooting",
    question: "When troubleshooting a Linux network issue using a bottom-up approach, what should you verify first?",
    options: {
      A: "The color theme of the command line prompt",
      B: "VM power state, network adapter connection, IP address, and then services",
      C: "The Windows desktop background",
      D: "Public social media posts"
    },
    correct: "B",
    explanation: "Bottom-up troubleshooting checks the lowest layer first: is the machine on? Is the cable/adapter connected? Does it have an IP? Then check higher-level applications."
  },
  {
    id: "W4-Q14",
    week: 4,
    topic: "Filesystem",
    question: "In the standard Linux filesystem hierarchy, where are system configuration files stored?",
    options: {
      A: "In the /etc directory",
      B: "In the /tmp folder only",
      C: "Linux does not have directories",
      D: "In the Windows C:\\Windows folder"
    },
    correct: "A",
    explanation: "In Linux, configuration files for services, networking, and system settings are stored under the '/etc' directory."
  },
  {
    id: "W4-Q15",
    week: 4,
    topic: "SSH hardening",
    question: "What is a standard security hardening practice for an SSH server on Linux?",
    options: {
      A: "Require SSH key authentication and disable direct root password logins",
      B: "Enable unencrypted Telnet on port 23 for everyone",
      C: "Publish the private key on a public website",
      D: "Delete all firewall rules permanently"
    },
    correct: "A",
    explanation: "Hardening SSH by disabling remote root password logins and requiring cryptographic keys prevents unauthorized access and brute-force attacks."
  },
  {
    id: "W4-Q16",
    week: 4,
    topic: "Services",
    question: "Which command is used on Ubuntu to check if the Nginx service is running, start it, or stop it?",
    options: {
      A: "systemctl (e.g., sudo systemctl status nginx)",
      B: "ipconfig /all",
      C: "diskpart",
      D: "netsh"
    },
    correct: "A",
    explanation: "Systemd's 'systemctl' command is the standard tool on modern Linux distributions to control and view the status of system services."
  },
  {
    id: "W4-Q17",
    week: 4,
    topic: "Evidence",
    question: "When taking screenshots for an IT lab submission or report, why must you never show real passwords?",
    options: {
      A: "To protect security, keep credentials confidential, and follow professional IT standards",
      B: "Because Linux computers cannot take screenshots",
      C: "Because VirtualBox forbids saving images",
      D: "Because passwords make image files too large"
    },
    correct: "A",
    explanation: "Professional IT practice requires sanitizing evidence: never expose live passwords or private personal data in reports or shared documentation."
  },
  {
    id: "W4-Q18",
    week: 4,
    topic: "Virtualization",
    question: "What is the main benefit of using VirtualBox 'Host-Only' networking for this lab?",
    options: {
      A: "It keeps all lab traffic safely isolated from the school's production network while still allowing communication between VMs and your host PC",
      B: "It automatically publishes your virtual machines to the public Internet",
      C: "It eliminates the need for any IP addresses",
      D: "It disables all virtualization features in the CPU"
    },
    correct: "A",
    explanation: "Host-Only networking creates a safe private sandbox where students can experiment with DHCP and Active Directory without affecting the rest of the campus."
  }
];
